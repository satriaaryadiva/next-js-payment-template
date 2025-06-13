import React, { useState } from "react";
 import { product } from "./libs/product";
 

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : null));
  };

  const increaseQuantity = () => {
    setQuantity((prevState) => prevState + 1);
  };

  const checkout = async () => {
  try {
    const data = {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
    };


    const response = await fetch("/api/tokenizer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      
      body: JSON.stringify(data),
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      alert("Gagal membuat token pembayaran");
      return;
    }

    const resultData = await response.json();
    const token = resultData.token;
    console.log("Payment token:", resultData);

    window.snap.pay( token, {
      onSuccess: function (result) {
        console.log("Payment success:", result);
        alert("Pembayaran berhasil!");
      },
      onPending: function (result) {
        console.log("Payment pending:", result);
        alert("Pembayaran sedang diproses, silakan tunggu.");
      },
      onError: function (result) {
        console.error("Payment error:", result);
        alert("Terjadi kesalahan saat memproses pembayaran.");
      },
      onClose: function () {
        console.log("Payment popup closed");
        alert("Popup pembayaran ditutup.");
      },
    });

     
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat checkout");
  }
};
  const generatePaymentLink = async () => {
    alert("Checkout Payment Link! 🔥");
  };

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex sm:gap-4">
            <button
            className="transition-all hover:opacity-75"
            onClick={decreaseQuantity}
          >
            ➖
          </button>

          <input
            type="number"
            id="quantity"
            value={quantity}
            className="h-10 w-16 text-black border-transparent text-center"
            onChange={(e) => setQuantity(Number(e.target.value))}

          />

          <button
            className="transition-all hover:opacity-75"
            onClick={increaseQuantity}
          >
            ➕
          </button>
        </div>
        <button
          className="rounded bg-indigo-500 p-4 text-sm font-medium transition hover:scale-105"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className="text-indigo-500 py-4 text-sm font-medium transition hover:scale-105"
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>
    </>
  );
};

export default Checkout;
