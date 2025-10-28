const API_URL = 'http://localhost:3000/api';

export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Đăng ký thất bại');
  }

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Đăng nhập thất bại');
  }

  return data;
};

export const verifyToken = async (token) => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Token không hợp lệ');
  }

  return data;
};

