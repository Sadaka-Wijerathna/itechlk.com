'use client'
import React, { useEffect, useState } from 'react';

const WhatsappButton = () => {
  const [phone, setPhone] = useState('+94742570943'); // fallback default

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.whatsappNumber) setPhone(data.whatsappNumber);
      })
      .catch(() => {}); // silently fail, keep default
  }, []);

  // Strip non-numeric chars for the wa.me link (keep + at start)
  const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  return (
    <>
      <style>
        {`
          @keyframes wa-pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
            }
            70% {
              transform: scale(1.05);
              box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
          }
          .whatsapp-float-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 55px;
            height: 55px;
            background-color: #25D366;
            color: #fff;
            border-radius: 50%;
            font-size: 30px;
            text-decoration: none;
            transition: all 0.3s ease;
            animation: wa-pulse 2s infinite;
          }
          .whatsapp-float-btn:hover {
            background-color: #1ebb5a;
            color: #fff;
            animation: none;
            transform: scale(1.1);
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999
      }}>
        <a 
          href={waLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-float-btn"
          aria-label="Chat with us on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </>
  );
};

export default WhatsappButton;
