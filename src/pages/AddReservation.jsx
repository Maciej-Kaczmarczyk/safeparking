import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddReservation = () => {
  const [formData, setFormData] = useState({
    imie_klienta: "",
    nazwisko_klienta: "",
    telefon_klienta: "",
    email_klienta: "",
    numer_rejestracyjny: "",
    marka_auta: "",
    model_auta: "",
    typ_miejsca: "Średnie",
    data_przyjazdu: "",
    data_odbioru: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja dat
    if (new Date(formData.data_przyjazdu) > new Date(formData.data_odbioru)) {
      alert("Data odbioru nie może być wcześniejsza niż data przyjazdu.");
      return;
    }

    try {
      await axios.post("https://vps.maciejkaczmarczyk.com/reservations", formData); // Endpoint do dodawania rezerwacji
      alert("Rezerwacja została dodana!");

      // Resetowanie formularza
      setFormData({
        imie_klienta: "",
        nazwisko_klienta: "",
        telefon_klienta: "",
        email_klienta: "",
        numer_rejestracyjny: "",
        marka_auta: "",
        model_auta: "",
        typ_miejsca: "Średnie",
        data_przyjazdu: "",
        data_odbioru: "",
      });

      // Przekierowanie na dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding reservation:", error);
      alert("Wystąpił błąd podczas dodawania rezerwacji.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Dodaj nową rezerwację</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
        {/* Dane klienta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Imię</label>
            <input type="text" name="imie_klienta" value={formData.imie_klienta} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Nazwisko</label>
            <input type="text" name="nazwisko_klienta" value={formData.nazwisko_klienta} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Telefon</label>
            <input
              type="text"
              name="telefon_klienta"
              value={formData.telefon_klienta}
              onChange={handleInputChange}
              className="w-full border rounded p-2 bg-white text-black"
              pattern="\d{9}" // Wymagane 9 cyfr
              title="Numer telefonu musi mieć 9 cyfr."
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input type="email" name="email_klienta" value={formData.email_klienta} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
        </div>

        {/* Dane pojazdu */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Numer rejestracyjny</label>
            <input type="text" name="numer_rejestracyjny" value={formData.numer_rejestracyjny} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Marka</label>
            <input type="text" name="marka_auta" value={formData.marka_auta} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Model</label>
            <input type="text" name="model_auta" value={formData.model_auta} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" />
          </div>
        </div>

        {/* Dane rezerwacji */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold mb-1">Typ miejsca</label>
            <select name="typ_miejsca" value={formData.typ_miejsca} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black">
              <option value="Małe">Małe</option>
              <option value="Średnie">Średnie</option>
              <option value="Duże">Duże</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Data przyjazdu</label>
            <input type="date" name="data_przyjazdu" value={formData.data_przyjazdu} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Data odbioru</label>
            <input type="date" name="data_odbioru" value={formData.data_odbioru} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-black" required />
          </div>
        </div>

        {/* Przyciski */}
        <button type="submit" className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded">
          Dodaj rezerwację
        </button>
      </form>
    </div>
  );
};

export default AddReservation;
