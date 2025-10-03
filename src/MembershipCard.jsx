import React from "react";

function MembershipCard({ type, benefits, price }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold">{type}</h3>
      <p className="text-gray-500 mb-2">{price}</p>
      <ul className="list-disc pl-4 mb-4 text-gray-600">
        {benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
        Nâng cấp
      </button>
    </div>
  );
}

export default MembershipCard;
