import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddServices = () => {
  const { id } = useParams(); // Get reservation ID from URL
  const [services, setServices] = useState([
    { name: "Mycie pojazdu", price: 50 },
    { name: "Ładowanie akumulatora", price: 30 },
    { name: "Sprawdzanie ciśnienia w oponach", price: 20 },
  ]);
  const [selectedService, setSelectedService] = useState(services[0].name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selected = services.find((service) => service.name === selectedService);

    const newService = {
      nazwa: selected.name,
      cena: selected.price,
      status: "Oczekująca",
      id_rezerwacji: id, // Attach the reservation ID
    };

    try {
      setLoading(true);
      await axios.post(`https://vps.maciejkaczmarczyk.com/reservation/${id}/services`, newService);
      alert("Usługa została dodana!");
      navigate(`/reservation/${id}`); // Redirect back to reservation details
    } catch (err) {
      console.error("Error adding service:", err);
      setError("Wystąpił błąd podczas dodawania usługi. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Dodaj usługę do rezerwacji</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
        {/* Select Service */}
        <div>
          <label className="block font-semibold mb-1">Usługa</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border rounded p-2 bg-white text-black"
          >
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name} ({service.price} PLN)
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded"
          disabled={loading}
        >
          {loading ? "Dodawanie..." : "Dodaj usługę"}
        </button>
      </form>
    </div>
  );
};

export default AddServices;
