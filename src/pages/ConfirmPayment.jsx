import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ConfirmPayment = () => {
  const { id } = useParams(); // Pobranie ID rezerwacji z URL
  const [paymentMethod, setPaymentMethod] = useState("Karta"); // Domyślna metoda płatności
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const paymentData = {
        metoda: paymentMethod,
        data_płatności: new Date().toISOString().split("T")[0], // Dzisiejsza data
      };
      await axios.post(`http://localhost:5000/reservation/${id}/payment`, paymentData);
      alert("Płatność została potwierdzona!");
      navigate(`/reservation/${id}`); // Przekierowanie z powrotem do szczegółów rezerwacji
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError("Wystąpił błąd podczas potwierdzania płatności.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Potwierdź płatność</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col gap-4 text-black">
        {/* Wybór metody płatności */}
        <div>
          <label className="block font-semibold mb-1">Metoda płatności</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded p-2 bg-white text-black"
          >
            <option value="Karta">Karta</option>
            <option value="Gotówka">Gotówka</option>
            <option value="Przelew">Przelew</option>
          </select>
        </div>

        {/* Przyciski */}
        <button
          onClick={handleConfirmPayment}
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded"
          disabled={loading}
        >
          {loading ? "Potwierdzanie..." : "Potwierdź płatność"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;
