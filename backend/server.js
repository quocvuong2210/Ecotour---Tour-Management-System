import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  getAllToursFromDb,
  getTourByIdFromDb,
  searchToursInDb,
  createTourInDb,
  updateTourInDb,
  deleteTourInDb,
  createTourBookingInDb
} from './db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'ecotour_secret_key_2024';

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
// Save to public/img directory (relative to project root)
const publicImgPath = join(__dirname, '..', 'public', 'img');
if (!existsSync(publicImgPath)) {
  mkdirSync(publicImgPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicImgPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `tour-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'));
    }
  }
});

// Helper function to read users from file
function getUsers() {
  try {
    const data = readFileSync(join(__dirname, 'data', 'users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write users to file
function saveUsers(users) {
  try {
    writeFileSync(join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const users = getUsers();

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const users = getUsers();

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const users = getUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Lỗi xác thực' });
  }
};

// Get user profile endpoint
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      profile: {
        name: user.name,
        email: user.email,
        gender: user.gender || '',
        day: user.day || '',
        month: user.month || '',
        year: user.year || '',
        city: user.city || '',
        emails: user.emails || [user.email]
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update user profile endpoint
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const { name, gender, day, month, year, city, emails } = req.body;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Update user profile
    if (name) users[userIndex].name = name;
    if (gender !== undefined) users[userIndex].gender = gender;
    if (day !== undefined) users[userIndex].day = day;
    if (month !== undefined) users[userIndex].month = month;
    if (year !== undefined) users[userIndex].year = year;
    if (city !== undefined) users[userIndex].city = city;
    if (emails && Array.isArray(emails)) {
      users[userIndex].emails = emails.filter(email => email && email.trim() !== '');
    }

    users[userIndex].updatedAt = new Date().toISOString();

    saveUsers(users);

    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      profile: {
        name: users[userIndex].name,
        email: users[userIndex].email,
        gender: users[userIndex].gender || '',
        day: users[userIndex].day || '',
        month: users[userIndex].month || '',
        year: users[userIndex].year || '',
        city: users[userIndex].city || '',
        emails: users[userIndex].emails || [users[userIndex].email]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==================== TOURS API ====================

// Upload image endpoint (admin only)
app.post('/api/tours/upload-image', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    // Return the path relative to public folder
    const imagePath = `/img/${req.file.filename}`;
    res.status(200).json({
      message: 'Upload ảnh thành công',
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: error.message || 'Lỗi upload ảnh' });
  }
});

// Get all tours (public)
app.get('/api/tours', (req, res) => {
  try {
    const tours = getAllToursFromDb();
    res.status(200).json({ tours });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Search tours (public)
app.get('/api/tours/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const tours = getAllToursFromDb();
      return res.status(200).json({ tours });
    }
    const tours = searchToursInDb(q.trim());
    res.status(200).json({ tours });
  } catch (error) {
    console.error('Search tours error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get single tour (public)
app.get('/api/tours/:id', (req, res) => {
  try {
    const tour = getTourByIdFromDb(req.params.id);
    
    if (!tour) {
      return res.status(404).json({ error: 'Tour không tồn tại' });
    }
    
    res.status(200).json({ tour });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Create tour (admin only)
app.post('/api/tours', authenticateToken, isAdmin, (req, res) => {
  try {
    const {
      name,
      description,
      image,
      images,
      price,
      priceAdult,
      priceChild,
      duration,
      location
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const adultPriceValue = priceAdult !== undefined ? Number(priceAdult) : (price !== undefined ? Number(price) : null);
    const childPriceValue = priceChild !== undefined && priceChild !== null && priceChild !== '' ? Number(priceChild) : null;

    if (adultPriceValue !== null && Number.isNaN(adultPriceValue)) {
      return res.status(400).json({ error: 'Giá người lớn không hợp lệ' });
    }

    if (childPriceValue !== null && Number.isNaN(childPriceValue)) {
      return res.status(400).json({ error: 'Giá trẻ em không hợp lệ' });
    }

    const gallery = Array.isArray(images) ? images.filter(Boolean) : [];

    const newTour = createTourInDb({
      name,
      description,
      image: image || gallery[0] || '/img/default.jpg',
      images: gallery,
      price: price !== undefined ? Number(price) : adultPriceValue,
      priceAdult: adultPriceValue,
      priceChild: childPriceValue,
      duration: duration || '',
      location: location || '',
      userId: req.userId
    });

    res.status(201).json({
      message: 'Tạo tour thành công',
      tour: newTour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update tour (admin only)
app.put('/api/tours/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const {
      name,
      description,
      image,
      images,
      price,
      priceAdult,
      priceChild,
      duration,
      location
    } = req.body;

    const priceValue = price !== undefined ? Number(price) : undefined;
    if (price !== undefined && Number.isNaN(priceValue)) {
      return res.status(400).json({ error: 'Giá không hợp lệ' });
    }

    const adultPriceValue = priceAdult !== undefined ? Number(priceAdult) : undefined;
    if (priceAdult !== undefined && Number.isNaN(adultPriceValue)) {
      return res.status(400).json({ error: 'Giá người lớn không hợp lệ' });
    }

    const childPriceValue = priceChild !== undefined ? Number(priceChild) : undefined;
    if (priceChild !== undefined && Number.isNaN(childPriceValue)) {
      return res.status(400).json({ error: 'Giá trẻ em không hợp lệ' });
    }

    const gallery = Array.isArray(images) ? images.filter(Boolean) : undefined;

    const tour = getTourByIdFromDb(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour không tồn tại' });
    }

    const updatedTour = updateTourInDb(req.params.id, {
      name,
      description,
      image,
      images: gallery,
      price: priceValue,
      priceAdult: adultPriceValue,
      priceChild: childPriceValue,
      duration,
      location
    });

    res.status(200).json({
      message: 'Cập nhật tour thành công',
      tour: updatedTour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Delete tour (admin only)
app.delete('/api/tours/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const tour = getTourByIdFromDb(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour không tồn tại' });
    }

    deleteTourInDb(req.params.id);

    res.status(200).json({ message: 'Xóa tour thành công' });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Book tour (public)
app.post('/api/tours/:id/book', (req, res) => {
  try {
    const tour = getTourByIdFromDb(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour không tồn tại' });
    }

    const { name, email, phone, adults, children, startDate, notes } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin liên hệ' });
    }

    const adultsNumber = adults !== undefined ? Number(adults) : 1;
    const childrenNumber = children !== undefined ? Number(children) : 0;

    if (Number.isNaN(adultsNumber) || adultsNumber < 0) {
      return res.status(400).json({ error: 'Số lượng người lớn không hợp lệ' });
    }

    if (Number.isNaN(childrenNumber) || childrenNumber < 0) {
      return res.status(400).json({ error: 'Số lượng trẻ em không hợp lệ' });
    }

    const participantsNumber = Math.max(adultsNumber + childrenNumber, 1);

    const bookingId = createTourBookingInDb({
      tourId: req.params.id,
      customerName: name,
      email,
      phone,
      participants: participantsNumber,
      adults: adultsNumber || 0,
      children: childrenNumber || 0,
      startDate,
      notes
    });

    res.status(201).json({
      message: 'Đặt tour thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất!',
      bookingId
    });
  } catch (error) {
    console.error('Book tour error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==================== ADMIN USERS API ====================

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
  try {
    const users = getUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.status(200).json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get single user (admin only)
app.get('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Create user (admin only)
app.post('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const users = getUsers();

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Tạo người dùng thành công',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update user (admin only)
app.put('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Update user
    if (name) users[userIndex].name = name;
    if (email) {
      // Check if email is already used by another user
      const emailExists = users.find((u, idx) => u.email === email && idx !== userIndex);
      if (emailExists) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
      users[userIndex].email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }
      users[userIndex].password = await bcrypt.hash(password, 10);
    }
    if (role) users[userIndex].role = role;
    users[userIndex].updatedAt = new Date().toISOString();

    saveUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.status(200).json({
      message: 'Cập nhật người dùng thành công',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Prevent deleting yourself
    if (users[userIndex].id === req.userId) {
      return res.status(400).json({ error: 'Không thể xóa chính mình' });
    }

    users.splice(userIndex, 1);
    saveUsers(users);

    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

