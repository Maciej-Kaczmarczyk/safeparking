import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import nawigacji
import axios from "axios";
import useAuthStore from "../store/authStore"; // Import Zustand

function Login() {
  // Stany lokalne dla loginu i hasła
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Zustand: funkcja logowania i nawigacja
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Funkcja obsługująca logowanie
  const handleLogin = async () => {
    try {
      // Wysłanie danych do backendu
      const response = await axios.post("https://vps.maciejkaczmarczyk.com/login", {
        username,
        password,
      });

      // Destrukturyzacja odpowiedzi
      const { token, firstName, lastName, role } = response.data;

      // Zapisanie danych do Zustand
      login(token, firstName, lastName, role);

      // Przekierowanie na panel główny
      navigate("/dashboard");
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      // Obsługa błędów
      alert("Nie udało się zalogować. Sprawdź dane logowania.");
    }
  };

  return (
    <div className="flex flex-col mt-24 gap-6 bg-white w-full max-w-96 rounded-b-xl shadow-md">
      <div className="w-full h-2 bg-[#FFD400]"></div>
      <div className="flex flex-col gap-10 bg-white px-6 py-8">
        <h1 className="text-black font-bold text-3xl">Zaloguj się</h1>
        <div className="flex gap-2 flex-col justify-start w-full">
          <h2 className="text-black">Login</h2>
          <input className="bg-white border-black border-2 w-full p-1 rounded-md focus:border-[#FFD400] outline-none text-black" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Podaj login" />
        </div>
        <div className="flex gap-2 flex-col justify-start w-full">
          <h2 className="text-black">Hasło</h2>
          <input className="bg-white border-black border-2 w-full p-1 rounded-md outline-none focus:border-[#FFD400] text-black" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Podaj hasło" />
        </div>
        <button onClick={handleLogin} className="mt-8 text-black bg-[#FFD400] px-10 py-2 rounded-xl hover:bg-black hover:text-white duration-200">
          Zaloguj
        </button>
      </div>
    </div>
  );
}

export default Login;
