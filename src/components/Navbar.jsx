import React from "react";
import ButtonBlack from "./ButtonBlack";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleLogout = () => {
    useAuthStore.setState({ isAuthenticated: false });
    useAuthStore.setState({ token: "" });
    useAuthStore.setState({ firstName: "" });
    useAuthStore.setState({ lastName: "" });
    useAuthStore.setState({ role: "" });
    navigate("/login");
  };

  return !isAuthenticated ? (
    <div className="flex justify-center items-center w-full py-6 px-10 bg-[#FFD400]">
      <h1 className=" text-black font-bold text-2xl">SafeParking</h1>
    </div>
  ) : (
    <div className="flex justify-between items-center w-full py-6 px-10 bg-[#FFD400]">
      <div className="flex items-center gap-12">
        <h1 className=" text-black font-bold text-2xl">SafeParking</h1>
        <div className="flex items-center gap-4 text-black font-semibold underline">
          <p onClick={() => navigate("/dashboard")} className="text-black font-semibold hover:cursor-pointer">
            Rezerwacje
          </p>
          {role === "Praconik ochrony" ? (
            <p onClick={() => navigate("/cameras")} className="text-black font-semibold hover:cursor-pointer">
              Monitoring
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-4 text-black font-semibold">
        <p>
          {firstName} {lastName} - {role}
        </p>
        <button onClick={handleLogout} className="text-white bg-black px-10 py-2 rounded-xl hover:bg-white hover:text-black duration-200">
          Wyloguj
        </button>
      </div>
    </div>
  );
}

export default Navbar;
