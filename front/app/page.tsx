"use client";

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Home() {
  const [amount, setAmount] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");

  const generateQRCode = async (event: any) => {
    event.preventDefault();
    const parsedAmount = parseFloat(amount);

    // Validation: Ensure input is a number and greater than 0
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire("Error", "กรุณากรอกจำนวนเงินที่ถูกต้อง (มากกว่า 0)", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/generateQR", {
        amount: parsedAmount,
      });

      console.log(response.data.Result);

      const { RespCode, Result } = response.data;
      if (RespCode === 200) {
        setQrCode(Result);
        Swal.fire("สำเร็จ", "QR Code ถูกสร้างเรียบร้อย", "success");
      } else {
        Swal.fire("Error", "เกิดข้อผิดพลาดในการสร้าง QR Code", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form onSubmit={generateQRCode} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          สร้าง PromptPay QR Code
        </h1>
        <input
          type="text"
          placeholder="กรอกจำนวนเงิน"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          สร้าง QR Code
        </button>
        {qrCode && (
          <div className="mt-6 text-center">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-64 h-64 mx-auto rounded-lg border shadow-md"
            />
          </div>
        )}
      </form>
    </div>
  );
}
