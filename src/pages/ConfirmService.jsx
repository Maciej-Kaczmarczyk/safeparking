import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ConfirmService = () => {
  const { id } = useParams(); // ID rezerwacji
  const [services, setServices] = useState([]); // Lista usług dla danej rezerwacji
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pobranie usług dodatkowych dla danej rezerwacji
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reservation/${id}/services`);
        console.log("Fetched services:", response.data); // Logowanie danych
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err); // Logowanie błędu
        setError("Wystąpił błąd podczas pobierania usług.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [id]);

  // Zmiana statusu usługi na "Zrealizowana"
  const handleConfirmService = async (serviceId) => {
    try {
      await axios.patch(`http://localhost:5000/reservation/${id}/services/${serviceId}/status`, {
        status: "Zrealizowana",
      });
      alert("Status usługi został zmieniony na Zrealizowana.");
      // Aktualizacja listy usług po zmianie statusu
      setServices((prevServices) => prevServices.map((service) => (service.id_usługi === serviceId ? { ...service, status: "Zrealizowana" } : service)));
    } catch (err) {
      console.error("Error confirming service:", err);
      setError("Wystąpił błąd podczas zmiany statusu usługi.");
    }
  };

  if (loading) return <p>Ładowanie usług...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Zmień status usług</h1>
      <div className="flex flex-col gap-4">
        {services.map((service) => (
          <div key={service.id_usługi} className="flex justify-between items-center text-black bg-gray-100 p-4 rounded">
            <div>
              <p className="font-semibold">{service.nazwa}</p>
              <p>{service.cena} PLN</p>
              <p>Status: {service.status}</p>
            </div>
            {service.status !== "Zrealizowana" && (
              <button onClick={() => handleConfirmService(service.id_usługi)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded">
                Potwierdź
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 mt-6 rounded" onClick={() => navigate(-1)}>
        Wróć
      </button>
    </div>
  );
};

export default ConfirmService;
