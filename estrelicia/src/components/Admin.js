import React, { useState, useEffect } from "react";
import "./Admin.css";

const API_BASE = "http://localhost:3001";

const images = [
  "Img1.png",
  "Img2.jpg",
  "Img3.jpg",
  "Img4.jpg",
  "Img5.jpg",
  "Img6.png",
  "video-1.mp4"
];



const AdminCard = ({ imgName, password }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Choose a file first");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(
        `http://localhost:3001/admin/upload/${imgName}`,
        {
          method: "POST",
          headers: {
            "x-admin-password": password
          },
          body: formData
        }
      );

      if (!res.ok) throw new Error();

      alert(`${imgName} replaced successfully!`);

      setSelectedFile(null);
    } catch {
      alert("Upload failed");
    }
  };
  const src = `http://localhost:3001/images/${imgName}?t=${Date.now()}`;

  return (
    <div className="admin-card">
       <div className="admin-preview">
        {imgName.endsWith(".mp4") ? (
          <video src={src} muted loop autoPlay preload="metadata"/>
        ) : (
          <img src={src} alt="" />
        )}
      </div>

      <div className="admin-controls">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          Replace
        </button>
      </div>

    </div>
  );
};

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("adminAuthenticated");
    const storedPassword = localStorage.getItem("adminPassword");

    if (storedAuth === "true" && storedPassword) {
      setPassword(storedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
  fetch("http://localhost:3001/settings", {
  })
    .then(res => res.json())
    .then(data => {
      setPrice(data.pricePerNight);
      setPopupEnabled(data.popup.enabled);
      setShowPrice(data.showPrice);
    });
  }, []);

  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!res.ok) throw new Error();

      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminPassword", password);
      setIsAuthenticated(true);
      setError("");
    } catch {
      setError("Wrong password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-firstcontainer">
        <div className="admin-wrapper">
          <div className="admin-form-box">
            <form onSubmit={handleLogin}>
              <h1>Admin</h1>
              <div className="admin-input-box">
                <i class="fa-solid fa-lock"/>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit">Login</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>


      <div className="admin-section price-section">
        <h3>Preço por Noite</h3>

        <label style={{ marginBottom: "10px", display: "block" }}>
          <input
            type="checkbox"
            checked={showPrice}
            onChange={async (e) => {
              const newValue = e.target.checked;

              await fetch("http://localhost:3001/admin/update-show-price", {
               method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-admin-password": password
                },
                body: JSON.stringify({ showPrice: newValue })
              });

              setShowPrice(newValue);
           }}
          />
          Mostrar preço no calendário
        </label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={async () => {
            const res = await fetch("http://localhost:3001/admin/update-price", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-admin-password": password
              },
              body: JSON.stringify({ price })
            });

            const data = await res.json();
            alert(data.message);
          }}
        >
          Atualizar Preço
        </button>
      </div>

      <div className="admin-section popup-section">
          <h3>Homepage Popup</h3>

         <label>
            <input
              type="checkbox"
             checked={popupEnabled}
            onChange={async (e) => {
               const newValue = e.target.checked;

                await fetch("http://localhost:3001/admin/update-popup", {
                  method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                   "x-admin-password": password
                 },
                  body: JSON.stringify({ enabled: newValue })
               });

                setPopupEnabled(newValue);
             }}
            />
            Popup
          </label>

          <AdminCard
            imgName="popup.jpg"
           password={password}
          />
        </div>
      <div className="admin-section gallery-section">
        <div className="admin_grid">
          {images.map((imgName) => (
            <AdminCard
              key={imgName}
              imgName={imgName}
              password={password}
            />
          ))}
        </div>
        
      </div>

      <div className="admin-section">
        <h3>Subscritores</h3>

        <button
          onClick={() => {
            fetch("http://localhost:3001/admin/download-subscribers", {
             headers: {
                "x-admin-password": password
              }
            })
            .then(res => res.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = "subscribers.txt";
              document.body.appendChild(a);
              a.click();
              a.remove();
            });
          }}
        >
          Download Subscritores
        </button>
      </div>
    </div>
  );
};

export default Admin;