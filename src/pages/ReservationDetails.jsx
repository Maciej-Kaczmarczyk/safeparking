import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

const ReservationDetails = () => {
  const { id } = useParams(); // Pobranie ID rezerwacji z URL
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate between pages
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reservation/${id}` // Endpoint szczegółów rezerwacji
        );
        setReservation(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/reservation/${id}/status`, { status: newStatus });
      alert(`Status został zmieniony na: ${newStatus}`);
      setReservation((prev) => ({
        ...prev,
        status_rezerwacji: response.data.data.status,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Wystąpił błąd podczas zmiany statusu.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reservation) return <p>Rezerwacja nie została znaleziona.</p>;

  console.log(reservation);

  function checkStatus(status) {
    if (status === "Wydano") {
      return "text-green-600";
    } else if (status === "Nieprzyjęto") {
      return "text-red-600";
    } else {
      return "text-yellow-600";
    }
  }

  const calculateTotalCost = (reservation) => {
    if (!reservation) return 0;

    // Koszty dzienne w zależności od typu miejsca
    const dailyCosts = {
      Małe: 20,
      Średnie: 30,
      Duże: 50,
    };

    // Oblicz liczbę dni między datą przyjazdu a datą odbioru
    const dateArrival = new Date(reservation.data_przyjazdu);
    const dateDeparture = new Date(reservation.data_odbioru);
    const days = Math.max(
      Math.ceil((dateDeparture - dateArrival) / (1000 * 60 * 60 * 24)),
      1 // Minimalna opłata za 1 dzień
    );

    // Koszt za miejsce parkingowe
    const parkingCost = (dailyCosts[reservation.typ_miejsca] || 0) * days;

    // Koszt dodatkowych usług

    const calculateAdditionalServicesCost = (reservation) => {
      if (!reservation || !reservation.uslugi_dodatkowe || !Array.isArray(reservation.uslugi_dodatkowe)) {
        return 0; // Zwraca 0, jeśli nie ma usług dodatkowych
      }

      // Sumowanie cen usług dodatkowych
      return reservation.uslugi_dodatkowe.reduce((total, service) => {
        return total + parseFloat(service.cena); // Zamiana ceny na liczbę (jeśli jest stringiem) i dodanie do sumy
      }, 0);
    };

    // Całkowity koszt
    return parkingCost + calculateAdditionalServicesCost(reservation);
  };

  function checkStatusUsługi(status) {
    if (status === "Zrealizowana") {
      return "text-green-600";
    } else if (status === "Oczekująca") {
      return "text-red-600";
    } else {
      return "text-yellow-600";
    }
  }

  return (
    <div className="w-full">
      <button className="text-black font-semibold text-2xl underline pb-4" onClick={() => navigate("/dashboard")}>
        {" "}
        Wróć
      </button>

      <div className="w-full flex flex-col gap-4 items-center text-black p-8 bg-white border-t-4 border-yellow-300">
        <div className="flex w-full justify-between gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <strong>Klient</strong>
              <p className=" font-normal text-1xl">{reservation.imię_klienta + " " + reservation.nazwisko_klienta}</p>
              <p className=" font-normal text-1xl">{reservation.email_klienta}</p>
              <p className=" font-normal text-1xl">{reservation.telefon_klienta}</p>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Rezerwacja od</strong>
              <p className=" font-normal text-1xl">{new Date(reservation.data_przyjazdu).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Rezerwacja do</strong>
              <p className=" font-normal text-1xl">{new Date(reservation.data_odbioru).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Zarezerwowane miejsce:</strong>
              <p className=" font-normal text-1xl">Numer: {reservation.numer_miejsca}</p>
              <p className=" font-normal text-1xl">Typ: {reservation.typ_miejsca}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <strong>Status pojazdu</strong>
              <p className={`font-normal text-1xl + ${checkStatus(reservation.status_rezerwacji)}`}>{reservation.status_rezerwacji}</p>
              <strong>Dane pojazdu</strong>
              <p>
                {reservation.marka_auta} {reservation.model_auta}
              </p>
              <p>Rejestracja: {reservation.numer_rejestracyjny}</p>
            </div>
            {role === "Kierownik" || role === "Pracownik biura" ? (
              <div className="flex flex-col gap-1">
                <strong>Status pojazdu</strong>
                <select
                  value={reservation.status_rezerwacji}
                  onChange={(e) => handleStatusChange(e.target.value)} // Wywołanie funkcji zmiany statusu
                  className="w-full border rounded p-2 bg-white text-black"
                >
                  <option value="Nieprzyjęto">Nieprzyjęto</option>
                  <option value="Przyjęto">Przyjęto</option>
                  <option value="Wydano">Wydano</option>
                </select>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <strong>Usługi dodatkowe</strong>
              {reservation.uslugi_dodatkowe.map((usługa) => (
                <>
                  <p className=" font-normal text-1xl">{usługa.nazwa}</p>
                  <p className=" font-normal text-1xl">{usługa.cena} PLN</p>
                  <p className={`font-normal text-1xl + ${checkStatusUsługi(usługa.status)}`}>{usługa.status}</p>
                </>
              ))}
            </div>
            {role === "Kierownik" ? (
              <button onClick={() => navigate(`/reservation/${id}/services`)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded">
                Dodaj usługę
              </button>
            ) : null}
            {role === "Procownik biura" ? (
              <button onClick={() => navigate(`/reservation/${id}/services`)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded">
                Dodaj usługę
              </button>
            ) : null}
            {role === "Pracownik techniczny" && reservation.uslugi_dodatkowe[0] ? (
              <button onClick={() => navigate(`/reservation/${id}/confirmService`)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded">
                Potwierdź wykonanie
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <strong>Status płatności</strong>
              <p className={reservation.metoda_płatności != "Nieopłacono" ? "text-green-600" : "text-red-600"}>{reservation.metoda_płatności != "Nieopłacono" ? "Opłacona" : "Nie opłacono"}</p>
              <p>{reservation.metoda_płatności ? `Metoda: ${reservation.metoda_płatności}` : "Nie opłacono"}</p>
              <div>
                <strong>Data płatności:</strong>
                <p>{reservation.data_płatności ? new Date(reservation.data_płatności).toLocaleDateString() : "nieopłacono"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong>Całkowity koszt</strong>
                <p className="font-normal text-1xl">{calculateTotalCost(reservation)} PLN</p>
              </div>
            </div>
            {(reservation.metoda_płatności === "Nieopłacono" && role === "Kierownik") || role === "Pracownik biura" ? (
              <button onClick={() => navigate(`/reservation/${id}/payment`)} type="submit" className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 mt-4 rounded">
                Potwierdź płatność
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
