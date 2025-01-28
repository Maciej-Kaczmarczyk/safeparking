import React from "react";

const ButtonColor = ({ children, className, onClick }) => {
  return <button onClick={onClick} className={` text-black bg-[#FFD400] px-10 py-2 rounded-xl hover:bg-black hover:text-white duration-200 ` + className}>{children}</button>;
};

export default ButtonColor;
