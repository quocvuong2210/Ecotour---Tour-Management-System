import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'ecotour_secret_key_2024';

app.use(cors());
app.use(express.json());

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
        email: user.email
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
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

