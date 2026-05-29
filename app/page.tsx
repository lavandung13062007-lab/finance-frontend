"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  
  // ĐÂY CHÍNH LÀ ĐỊA CHỈ MÁY CHỦ RENDER CỦA BẠN (Tôi đã điền sẵn giúp bạn)
  const BACKEND_URL = "https://finance-backend-1-he8m.onrender.com";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.log("Lỗi kết nối hoặc chưa có dữ liệu", err));
  }, []);

  return (
    <main className="p-4 max-w-md mx-auto bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Tài Chính Của Dũng</h1>
      
      {/* Khối hiển thị Tổng tiền */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <p className="text-sm opacity-90 mb-1">Tổng số dư khả dụng</p>
        <h2 className="text-4xl font-extrabold">10,000,000 đ</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Lịch sử giao dịch</h3>
        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
          + Thêm mới
        </button>
      </div>
      
      {/* Danh sách các khoản Thu/Chi */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 italic">Chưa có giao dịch nào.</p>
          </div>
        ) : (
          transactions.map((t: any) => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-white shadow-sm rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.type === "thu_nhap" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {t.type === "thu_nhap" ? "T" : "C"}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.description}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === "thu_nhap" ? "text-green-500" : "text-red-500"}`}>
                {t.type === "thu_nhap" ? "+" : "-"}{t.amount} đ
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}