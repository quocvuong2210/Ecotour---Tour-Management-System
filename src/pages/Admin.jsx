import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getTours,
  createTour,
  updateTour,
  deleteTour,
  uploadTourImage
} from '../services/api';

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'tours'
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const emptyTourForm = {
    name: '',
    description: '',
    image: '',
    gallery: [],
    priceAdult: '',
    priceChild: '',
    duration: '',
    location: ''
  };

  // Tour form state
  const [tourForm, setTourForm] = useState(emptyTourForm);
  const [editingTour, setEditingTour] = useState(null);
  const [showTourModal, setShowTourModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const usersData = await getAdminUsers();
        setUsers(usersData);
      } else {
        const toursData = await getTours();
        setTours(toursData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [activeTab]);

  // User CRUD functions
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'user' });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'user'
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        const updateData = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role
        };
        if (userForm.password) {
          updateData.password = userForm.password;
        }
        await updateAdminUser(editingUser.id, updateData);
        setSuccess('Cập nhật người dùng thành công');
      } else {
        await createAdminUser(userForm);
        setSuccess('Tạo người dùng thành công');
      }
      setShowUserModal(false);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteAdminUser(id);
      setSuccess('Xóa người dùng thành công');
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tour CRUD functions
  const handleCreateTour = () => {
    setEditingTour(null);
    setTourForm(emptyTourForm);
    setSelectedImageFile(null);
    setImagePreview(null);
    setGalleryUploadLoading(false);
    setShowTourModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setTourForm({
      name: tour.name,
      description: tour.description,
      image: tour.image,
      gallery: tour.images || [],
      priceAdult: tour.adultPrice ? tour.adultPrice.toString() : '',
      priceChild: tour.childPrice ? tour.childPrice.toString() : '',
      duration: tour.duration,
      location: tour.location
    });
    setSelectedImageFile(null);
    setImagePreview(tour.image || null);
    setGalleryUploadLoading(false);
    setShowTourModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setGalleryUploadLoading(true);
    setError('');

    try {
      const uploadedPaths = [];
      for (const file of files) {
        const uploadedPath = await uploadTourImage(file);
        uploadedPaths.push(uploadedPath);
      }

      setTourForm((prev) => {
        const currentGallery = prev.gallery || [];
        const updatedGallery = [...currentGallery, ...uploadedPaths];
        return {
          ...prev,
          gallery: updatedGallery,
          image: prev.image || uploadedPaths[0]
        };
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setGalleryUploadLoading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setTourForm((prev) => {
      const updated = [...(prev.gallery || [])];
      const [removed] = updated.splice(index, 1);
      let newImage = prev.image;
      if (removed === prev.image) {
        newImage = updated[0] || '';
      }
      return {
        ...prev,
        gallery: updated,
        image: newImage
      };
    });
  };

  const handleCloseTourModal = () => {
    setShowTourModal(false);
    setSelectedImageFile(null);
    setImagePreview(null);
    setGalleryUploadLoading(false);
    setTourForm(emptyTourForm);
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imagePath = tourForm.image;

      // Upload cover image if a new file is selected
      if (selectedImageFile) {
        imagePath = await uploadTourImage(selectedImageFile);
      }

      let galleryImages = [...(tourForm.gallery || [])];
      if (imagePath && !galleryImages.includes(imagePath)) {
        galleryImages = [imagePath, ...galleryImages];
      }

      const adultPriceValue = tourForm.priceAdult !== '' ? Number(tourForm.priceAdult) : null;
      const childPriceValue = tourForm.priceChild !== '' ? Number(tourForm.priceChild) : null;

      if (tourForm.priceAdult !== '' && Number.isNaN(adultPriceValue)) {
        throw new Error('Giá người lớn không hợp lệ');
      }

      if (tourForm.priceChild !== '' && Number.isNaN(childPriceValue)) {
        throw new Error('Giá trẻ em không hợp lệ');
      }

      const tourData = {
        name: tourForm.name,
        description: tourForm.description,
        image: imagePath,
        images: galleryImages,
        priceAdult: adultPriceValue,
        priceChild: childPriceValue,
        duration: tourForm.duration,
        location: tourForm.location
      };

      if (editingTour) {
        await updateTour(editingTour.id, tourData);
        setSuccess('Cập nhật tour thành công');
      } else {
        await createTour(tourData);
        setSuccess('Tạo tour thành công');
      }
      handleCloseTourModal();
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteTour(id);
      setSuccess('Xóa tour thành công');
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return 'Liên hệ';
    }
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Admin</h1>
            <p className="text-gray-600">Quản lý người dùng và tours</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Người dùng
              </button>
              <button
                onClick={() => setActiveTab('tours')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tours'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Tours
              </button>
            </nav>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Danh sách Người dùng</h2>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm Người dùng
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {u.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {u.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('vi-VN')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={u.id === user.id}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tours Tab */}
          {activeTab === 'tours' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Danh sách Tours</h2>
                <button
                  onClick={handleCreateTour}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm Tour
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên Tour
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá người lớn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá trẻ em
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Địa điểm
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tours.map((tour) => (
                        <tr key={tour.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {tour.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {tour.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(tour.adultPrice ?? tour.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(tour.childPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tour.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditTour(tour)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* User Modal */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">
                  {editingUser ? 'Sửa Người dùng' : 'Thêm Người dùng'}
                </h3>
                <form onSubmit={handleSaveUser}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu {editingUser && '(để trống nếu không đổi)'}
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tour Modal */}
          {showTourModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">
                  {editingTour ? 'Sửa Tour' : 'Thêm Tour'}
                </h3>
                <form onSubmit={handleSaveTour}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên Tour
                    </label>
                    <input
                      type="text"
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={tourForm.description}
                      onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hình ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                    {!imagePreview && editingTour && tourForm.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Ảnh hiện tại:</p>
                        <img
                          src={tourForm.image}
                          alt="Current"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Chọn ảnh từ máy tính của bạn (JPG, PNG, tối đa 5MB)
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bộ sưu tập ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {galleryUploadLoading && (
                      <p className="text-sm text-gray-500 mt-2">Đang tải ảnh...</p>
                    )}
                    {tourForm.gallery && tourForm.gallery.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {tourForm.gallery.map((img, index) => (
                          <div key={`${img}-${index}`} className="relative group">
                            <img
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Có thể chọn nhiều ảnh, ảnh đầu tiên sẽ dùng làm ảnh chính nếu chưa chọn ảnh bìa
                    </p>
                  </div>
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá người lớn (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={tourForm.priceAdult}
                        onChange={(e) => setTourForm({ ...tourForm, priceAdult: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá trẻ em (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={tourForm.priceChild}
                        onChange={(e) => setTourForm({ ...tourForm, priceChild: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian
                    </label>
                    <input
                      type="text"
                      value={tourForm.duration}
                      onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="2 ngày 1 đêm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      value={tourForm.location}
                      onChange={(e) => setTourForm({ ...tourForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseTourModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Admin;

