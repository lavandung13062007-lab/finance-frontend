"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("chi_tieu");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");

  const BACKEND_URL = "https://finance-backend-1-he8m.onrender.com";

  const fetchTransactions = () => {
    fetch(`${BACKEND_URL}/api/transactions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
          setErrorMessage(""); 
        } else {
          setTransactions([]); 
          setErrorMessage(JSON.stringify(data)); 
        }
      })
      .catch((err) => {
        setErrorMessage("Không thể kết nối đến Máy chủ. Đang chờ Máy chủ khởi động, vui lòng thử lại sau 1 phút.");
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateTotal = () => {
    if (!Array.isArray(transactions)) return 0;
    let total = 0;
    transactions.forEach((t: any) => {
      const val = parseFloat(t.amount) || 0;
      if (t.type === "thu_nhap") total += val;
      else total -= val;
    });
    return total;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const newTransaction = { amount, type, category, description };

    try {
      const res = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      const data = await res.json();
      
      if (data.error) {
        alert("Lỗi khi lưu: " + data.error);
      } else {
        setAmount("");
        setCategory("");
        setDescription("");
        setShowForm(false);
        fetchTransactions(); 
      }
    } catch (error) {
      alert("Đã xảy ra sự cố khi gửi dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto bg-gray-50 min-h-screen font-sans relative">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Tài Chính Của Dũng</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm overflow-auto text-xs">
          <p className="font-bold mb-1">Máy chủ báo lỗi:</p>
          <p>{errorMessage}</p>
          <p className="mt-2 text-gray-600 font-semibold">Gợi ý: Nếu bạn vừa mới tạo Supabase, hãy kiểm tra lại cài đặt.</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <p className="text-sm opacity-90 mb-1">Tổng số dư thực tế</p>
        <h2 className="text-4xl font-extrabold">{calculateTotal().toLocaleString("vi-VN")} đ</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Lịch sử giao dịch</h3>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform"
        >
          + Thêm mới
        </button>
      </div>
      
      <div className="space-y-3 pb-24">
        {(!Array.isArray(transactions) || transactions.length === 0) ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 italic">Chưa có giao dịch nào hoặc dữ liệu trống.</p>
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
                {t.type === "thu_nhap" ? "+" : "-"}{parseFloat(t.amount).toLocaleString("vi-VN")} đ
              </p>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Thêm giao dịch mới</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setType("chi_tieu")} className={`flex-1 py-2 rounded-lg font-bold ${type === "chi_tieu" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>Chi tiền</button>
                <button type="button" onClick={() => setType("thu_nhap")} className={`flex-1 py-2 rounded-lg font-bold ${type === "thu_nhap" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>Thu tiền</button>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">SỐ TIỀN (VNĐ)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full text-2xl font-bold border-b-2 border-gray-200 outline-none py-2 focus:border-blue-500" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">DANH MỤC</label>
                <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">GHI CHÚ</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">Hủy</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md">
                  {isLoading ? "Đang lưu..." : "Lưu lại"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}