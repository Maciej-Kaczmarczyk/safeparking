import React from "react";

function ButtonBlack({ children, className }) {
  return <button className={` text-white bg-black px-10 py-2 rounded-xl hover:bg-white hover:text-black duration-200 ` + className}>{children}</button>;
}

export default ButtonBlack;
