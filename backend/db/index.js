import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'ecotour.db');
const schemaPath = join(__dirname, 'schema.sql');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

const schema = readFileSync(schemaPath, 'utf8');
db.exec(schema);

const migrations = [
  'ALTER TABLE DichVu ADD COLUMN HinhAnhBoSuuTap TEXT',
  'ALTER TABLE DichVu ADD COLUMN GiaNguoiLon REAL',
  'ALTER TABLE DichVu ADD COLUMN GiaTreEm REAL',
  'ALTER TABLE DatTour ADD COLUMN SoNguoiLon INTEGER DEFAULT 1',
  'ALTER TABLE DatTour ADD COLUMN SoTreEm INTEGER DEFAULT 0'
];

for (const sql of migrations) {
  try {
    db.exec(sql);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Migration error:', error.message);
    }
  }
}

const selectTourFields = `
  SELECT 
    MaDichVu AS id,
    TenDichVu AS name,
    MoTa AS description,
    HinhAnh AS image,
    HinhAnhBoSuuTap AS gallery,
    Gia AS price,
    GiaNguoiLon AS adultPrice,
    GiaTreEm AS childPrice,
    ThoiLuong AS duration,
    DiaDiem AS location,
    LoaiDichVu AS type,
    NgayTao AS createdAt,
    NgayCapNhat AS updatedAt
  FROM DichVu
`;

const normalizeTourRow = (row) => {
  if (!row) return null;

  let images = [];
  if (row.gallery) {
    try {
      const parsed = JSON.parse(row.gallery);
      if (Array.isArray(parsed)) {
        images = parsed.filter(Boolean);
      }
    } catch (error) {
      images = [];
    }
  }

  const mainImage = row.image || images[0] || '/img/default.jpg';
  if (!images.length && mainImage) {
    images = [mainImage];
  } else if (mainImage && !images.includes(mainImage)) {
    images.unshift(mainImage);
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: mainImage,
    images,
    price: row.price,
    adultPrice: row.adultPrice ?? row.price ?? null,
    childPrice: row.childPrice ?? null,
    duration: row.duration,
    location: row.location,
    type: row.type,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
};

export function getAllToursFromDb() {
  const stmt = db.prepare(`${selectTourFields} ORDER BY datetime(NgayTao) DESC`);
  return stmt.all().map(normalizeTourRow);
}

export function getTourByIdFromDb(id) {
  const stmt = db.prepare(`${selectTourFields} WHERE MaDichVu = ?`);
  const row = stmt.get(id);
  return normalizeTourRow(row);
}

export function searchToursInDb(query) {
  const stmt = db.prepare(
    `${selectTourFields}
      WHERE TenDichVu LIKE @term
         OR DiaDiem LIKE @term
         OR MoTa LIKE @term
      ORDER BY datetime(NgayTao) DESC`
  );
  const term = `%${query}%`;
  return stmt.all({ term }).map(normalizeTourRow);
}

export function createTourInDb({ name, description, image, images = [], price, priceAdult, priceChild, duration, location, userId }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const stmt = db.prepare(`
    INSERT INTO DichVu (
      TenDichVu, MoTa, HinhAnh, HinhAnhBoSuuTap,
      Gia, GiaNguoiLon, GiaTreEm,
      ThoiLuong, DiaDiem, MaNguoiDung, NgayCapNhat
    )
    VALUES (
      @name, @description, @image, @gallery,
      @price, @adultPrice, @childPrice,
      @duration, @location, @userId, CURRENT_TIMESTAMP
    )
  `);

  const galleryJson = JSON.stringify(safeImages);
  const mainImage = image || safeImages[0] || '/img/default.jpg';
  const resolvedAdultPrice = priceAdult ?? price ?? null;

  const info = stmt.run({
    name,
    description,
    image: mainImage,
    gallery: galleryJson,
    price: resolvedAdultPrice,
    adultPrice: priceAdult ?? null,
    childPrice: priceChild ?? null,
    duration,
    location,
    userId: userId || null
  });

  return getTourByIdFromDb(info.lastInsertRowid);
}

export function updateTourInDb(id, { name, description, image, images, price, priceAdult, priceChild, duration, location }) {
  const stmt = db.prepare(`
    UPDATE DichVu
    SET
      TenDichVu = COALESCE(@name, TenDichVu),
      MoTa = COALESCE(@description, MoTa),
      HinhAnh = COALESCE(@image, HinhAnh),
      HinhAnhBoSuuTap = COALESCE(@gallery, HinhAnhBoSuuTap),
      Gia = COALESCE(@price, Gia),
      GiaNguoiLon = COALESCE(@adultPrice, GiaNguoiLon),
      GiaTreEm = COALESCE(@childPrice, GiaTreEm),
      ThoiLuong = COALESCE(@duration, ThoiLuong),
      DiaDiem = COALESCE(@location, DiaDiem),
      NgayCapNhat = CURRENT_TIMESTAMP
    WHERE MaDichVu = @id
  `);

  const galleryJson = Array.isArray(images) ? JSON.stringify(images.filter(Boolean)) : null;
  const resolvedAdultPrice = priceAdult ?? price ?? null;
  stmt.run({
    id,
    name,
    description,
    image,
    gallery: galleryJson,
    price: resolvedAdultPrice,
    adultPrice: priceAdult ?? null,
    childPrice: priceChild ?? null,
    duration,
    location
  });
  return getTourByIdFromDb(id);
}

export function deleteTourInDb(id) {
  const stmt = db.prepare(`DELETE FROM DichVu WHERE MaDichVu = ?`);
  return stmt.run(id);
}

export function createTourBookingInDb({ tourId, customerName, email, phone, participants, adults, children, startDate, notes }) {
  const stmt = db.prepare(`
    INSERT INTO DatTour (
      MaDichVu, TenKhach, Email, DienThoai,
      SoNguoi, SoNguoiLon, SoTreEm,
      NgayKhoiHanh, GhiChu
    )
    VALUES (
      @tourId, @customerName, @email, @phone,
      @participants, @adults, @children,
      @startDate, @notes
    )
  `);

  const resolvedParticipants = participants || 1;
  const resolvedAdults = adults ?? resolvedParticipants;
  const resolvedChildren = children ?? 0;

  const info = stmt.run({
    tourId,
    customerName,
    email,
    phone,
    participants: resolvedParticipants,
    adults: resolvedAdults,
    children: resolvedChildren,
    startDate: startDate || null,
    notes: notes || null
  });

  return info.lastInsertRowid;
}

function seedTours() {
  const count = db.prepare('SELECT COUNT(*) as total FROM DichVu').get().total;
  if (count > 0) return;

  try {
    const seedPath = join(dataDir, 'tours.json');
    if (!existsSync(seedPath)) return;
    const tours = JSON.parse(readFileSync(seedPath, 'utf8'));
    const insert = db.prepare(`
      INSERT INTO DichVu (
        TenDichVu, MoTa, HinhAnh, HinhAnhBoSuuTap,
        Gia, GiaNguoiLon, GiaTreEm,
        ThoiLuong, DiaDiem, NgayCapNhat
      )
      VALUES (
        @name, @description, @image, @gallery,
        @price, @adultPrice, @childPrice,
        @duration, @location, CURRENT_TIMESTAMP
      )
    `);

    const insertMany = db.transaction((items) => {
      for (const tour of items) {
        const gallery = tour.images && Array.isArray(tour.images)
          ? tour.images.filter(Boolean)
          : (tour.image ? [tour.image] : []);

        insert.run({
          name: tour.name,
          description: tour.description,
          image: tour.image,
          gallery: JSON.stringify(gallery),
          price: tour.price,
          adultPrice: tour.price ?? null,
          childPrice: tour.childPrice ?? null,
          duration: tour.duration,
          location: tour.location
        });
      }
    });

    insertMany(tours);
  } catch (error) {
    console.error('Seed tours error:', error);
  }
}

seedTours();

export default db;

