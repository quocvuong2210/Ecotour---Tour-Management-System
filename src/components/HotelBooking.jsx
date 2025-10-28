import React, { useState } from 'react';

function HotelBooking() {
  const [destination, setDestination] = useState('');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const popularCities = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Huế', 
    'Phú Quốc', 'Nha Trang', 'Đà Lạt', 'Sapa', 'Hạ Long'
  ];

  const handleSearch = () => {
    console.log('Searching for hotels:', {
      destination,
      nights,
      adults,
      children,
      rooms
    });
    // Add your search logic here
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg whitespace-nowrap">
          Khách sạn
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg whitespace-nowrap">
          Vé máy bay
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg whitespace-nowrap">
          Vé xe khách
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg whitespace-nowrap">
          Đưa đón sân bay
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg whitespace-nowrap">
          Cho thuê xe
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 rounded-lg whitespace-nowrap">
          Hoạt động
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2">Điểm đến</label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowDestinationDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
              placeholder="Chọn hoặc nhập tên khách sạn, thành phố..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">🏨</span>
          </div>
          
          {showDestinationDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-3 border-b">
                <p className="text-sm font-semibold text-gray-600">Thành phố phổ biến</p>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setDestination(city);
                      setShowDestinationDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span>📍</span>
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nights */}
        <div>
          <label className="block text-sm font-semibold mb-2">Số đêm</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setNights(Math.max(1, nights - 1))}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-l-lg"
            >
              -
            </button>
            <input
              type="number"
              value={nights}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setNights(Math.min(Math.max(1, value), 30));
              }}
              min="1"
              max="30"
              className="w-full text-center border-0 focus:outline-none"
            />
            <button
              onClick={() => setNights(Math.min(30, nights + 1))}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-r-lg"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Tối đa 30 đêm</p>
        </div>

        {/* Guests & Rooms */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2">Khách và phòng</label>
          <button
            onClick={() => setShowGuestSelector(!showGuestSelector)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400"
          >
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span className="flex-1">
                {adults} người lớn, {children} trẻ em, {rooms} phòng
              </span>
              <span>▼</span>
            </div>
          </button>

          {showGuestSelector && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              {/* Adults */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">Người lớn</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{adults}</span>
                    <button
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Từ 12 tuổi trở lên</p>
              </div>

              {/* Children */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">Trẻ em</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{children}</span>
                    <button
                      onClick={() => setChildren(Math.min(10, children + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Từ 2 đến 11 tuổi</p>
              </div>

              {/* Rooms */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">Phòng</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{rooms}</span>
                    <button
                      onClick={() => setRooms(Math.min(10, rooms + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Số lượng phòng</p>
              </div>

              <button
                onClick={() => setShowGuestSelector(false)}
                className="w-full mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Xác nhận
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full mt-4 px-6 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-between font-semibold"
      >
        <span>Tìm kiếm</span>
        <span className="text-2xl">🔍</span>
      </button>
    </div>
  );
}

export default HotelBooking;

