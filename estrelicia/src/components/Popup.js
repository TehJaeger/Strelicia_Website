import React, { useEffect, useState } from "react";
import "./Popup.css";

const Popup = () => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");

    const closePopup = () => {
    sessionStorage.setItem("popupSeen", "true");
    setVisible(false);
    };
    useEffect(() => {
    const seen = sessionStorage.getItem("popupSeen");

    if (seen) return;

    fetch("http://localhost:3001/settings")
        .then(res => res.json())
        .then(data => {
      if (data.popup.enabled) {
        setImage(data.popup.image);
        setVisible(true);
      }
    });}, []);
  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-image-wrapper">
            <img src={`http://localhost:3001/images/${image}`} alt="Popup" />
            <button className="popup-close" onClick={closePopup}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <button className="popup-ok-button" onClick={closePopup}>
              OK
            </button>
        </div>
    </div>
  );
};

export default Popup;

