import React from "react";
import parking from "../assets/parking.jpg";
import { useNavigate } from "react-router-dom";

const Cameras = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  return (
    <div className="w-full">
      <button className="text-black font-semibold text-2xl underline pb-4" onClick={() => navigate("/dashboard")}>
        {" "}
        Wróć
      </button>

      <div className="w-full flex flex-col gap-4 items-center text-black p-8 bg-white border-t-4 border-yellow-300">
        <div className="grid grid-cols-2 gap-4 w-full">
          <img src={parking} alt="Parking Camera 1" className="w-full h-auto aspect-video object-cover" />
          <img src={parking} alt="Parking Camera 2" className="w-full h-auto aspect-video object-cover" />
          <img src={parking} alt="Parking Camera 3" className="w-full h-auto aspect-video object-cover" />
          <img src={parking} alt="Parking Camera 4" className="w-full h-auto aspect-video object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Cameras;
