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

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải thông tin người dùng');
  }

  return data.profile;
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể cập nhật thông tin');
  }

  return data.profile;
};

// ==================== TOURS API ====================

export const uploadTourImage = async (imageFile) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_URL}/tours/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể upload ảnh');
  }

  return data.imagePath;
};

export const getTours = async () => {
  const response = await fetch(`${API_URL}/tours`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải danh sách tours');
  }

  return data.tours;
};

export const getTour = async (id) => {
  const response = await fetch(`${API_URL}/tours/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải thông tin tour');
  }

  return data.tour;
};

export const createTour = async (tourData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/tours`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tourData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tạo tour');
  }

  return data.tour;
};

export const updateTour = async (id, tourData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/tours/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tourData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể cập nhật tour');
  }

  return data.tour;
};

export const deleteTour = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/tours/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể xóa tour');
  }

  return data;
};

export const searchTours = async (query) => {
  const params = new URLSearchParams();
  if (query) {
    params.append('q', query);
  }

  const response = await fetch(`${API_URL}/tours/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Không thể tìm kiếm tour');
  }

  return data.tours;
};

export const bookTour = async (id, bookingData) => {
  const response = await fetch(`${API_URL}/tours/${id}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Không thể đặt tour');
  }

  return data;
};

// ==================== ADMIN API ====================

export const getAdminUsers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải danh sách người dùng');
  }

  return data.users;
};

export const getAdminUser = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải thông tin người dùng');
  }

  return data.user;
};

export const createAdminUser = async (userData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể tạo người dùng');
  }

  return data.user;
};

export const updateAdminUser = async (id, userData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể cập nhật người dùng');
  }

  return data.user;
};

export const deleteAdminUser = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Không thể xóa người dùng');
  }

  return data;
};

