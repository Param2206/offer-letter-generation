import React from "react";

const Loader = () => {
  return (
    <div
      className="spinner-border mt-1"
      role="status"
      style={{
        width: "45px",
        height: "45px",
        margin: "auto",
        display: "block",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loader;
