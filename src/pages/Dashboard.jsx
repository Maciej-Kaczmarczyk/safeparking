import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Wszystkie"); // Nowy stan dla filtra
  const navigate = useNavigate(); // Hook do nawigacji
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/reservations");
        setReservations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  function checkStatus(status) {
    if (status === "Wydano") {
      return "text-green-600";
    } else if (status === "Nieprzyjęto") {
      return "text-red-600";
    } else {
      return "text-yellow-600";
    }
  }

  // Funkcja do filtrowania danych
  const filterReservations = () => {
    if (filter === "Wszystkie") {
      return reservations;
    }
    if (filter === "W trakcie") {
      return reservations.filter((res) => res.status_rezerwacji !== "Wydano" || res.metoda_płatności === "Nieopłacono");
    }
    if (filter === "Zakończone") {
      return reservations.filter((res) => res.status_rezerwacji === "Wydano" && res.metoda_płatności !== "Nieopłacono");
    }
    return reservations;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <div className="flex w-full gap-8 justify-between items-center mb-8">
        <div className="flex gap-8 items-center ">
          <h1 className="text-black font-bold text-4xl">Rezerwacje</h1>

          <div className="flex gap-4 text-black text-sm">
            <button onClick={() => setFilter("Wszystkie")} className={` hover:brightness-75 px-4 py-2 rounded ${filter === "Wszystkie" ? "bg-yellow-300" : "bg-gray-300"}`}>
              Wszystkie
            </button>
            <button onClick={() => setFilter("W trakcie")} className={`hover:brightness-75 px-4 py-2 rounded ${filter === "W trakcie" ? "bg-yellow-300" : "bg-gray-300"}`}>
              W trakcie
            </button>
            <button onClick={() => setFilter("Zakończone")} className={` hover:brightness-75 px-4 py-2 rounded ${filter === "Zakończone" ? "bg-yellow-300" : "bg-gray-300"}`}>
              Zakończone
            </button>
          </div>
        </div>
        {role === "Kierownik" || role === "Pracownik biura" ? (
          <button onClick={() => navigate(`/addReservation`)} className="text-black bg-[#FFD400] px-10 py-2 rounded-xl font-semibold hover:bg-black hover:text-white duration-200">
            Dodaj rezerwację
          </button>
        ) : null}
      </div>

      {/* Nagłówki tabeli */}
      <div className="grid grid-cols-6 w-full text-black font-semibold p-4">
        <p>Imię i nazwisko</p>
        <p>Numer rejestracyjny</p>
        <p>Od</p>
        <p>Do</p>
        <p>Status pojazdu</p>
        <p>Status płatności</p>
      </div>

      {/* Dane rezerwacji */}
      {filterReservations().map((reservation) => (
        <div
          key={reservation.id_rezerwacji}
          onClick={() => navigate(`/reservation/${reservation.id_rezerwacji}`)} // Nawigacja po kliknięciu
          className="grid grid-cols-6 w-full text-black p-4 bg-white border-t-4 border-yellow-300 hover:bg-yellow-300 hover:cursor-pointer"
        >
          <p>{`${reservation.imię_klienta} ${reservation.nazwisko_klienta}`}</p>
          <p>{reservation.numer_rejestracyjny}</p>
          <p>{new Date(reservation.data_przyjazdu).toLocaleDateString()}</p>
          <p>{new Date(reservation.data_odbioru).toLocaleDateString()}</p>
          <p className={checkStatus(reservation.status_rezerwacji)}>{reservation.status_rezerwacji}</p>
          <p className={reservation.metoda_płatności !== "Nieopłacono" ? "text-green-600" : "text-red-600"}>{reservation.metoda_płatności !== "Nieopłacono" ? "Opłacona" : "Nie opłacono"}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
