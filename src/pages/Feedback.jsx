import React from "react";

function Feedback() {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">Gửi đánh giá</h2>
      <textarea
        className="w-full border rounded p-2 mb-3"
        placeholder="Chia sẻ trải nghiệm của bạn..."
      />
      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
        Gửi
      </button>
    </div>
  );
}

export default Feedback;
