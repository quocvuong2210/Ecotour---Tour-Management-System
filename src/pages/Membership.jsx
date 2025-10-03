import React from "react";
import MembershipCard from "../components/MembershipCard";

function Membership() {
  const tiers = [
    {
      type: "VIP",
      price: "999k / tháng",
      benefits: ["Ưu tiên đặt tour", "Giảm giá 20%", "Hỗ trợ riêng"],
    },
    {
      type: "SVIP",
      price: "1.999k / tháng",
      benefits: [
        "Tất cả quyền VIP",
        "Quà tặng đặc biệt",
        "Trải nghiệm riêng tư",
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {tiers.map((t) => (
        <MembershipCard key={t.type} {...t} />
      ))}
    </div>
  );
}

export default Membership;
