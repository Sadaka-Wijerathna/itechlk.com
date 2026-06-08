'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import useCartInfo from '@/hooks/use-cart-info';

const MiniCart = dynamic(() => import('@/layout/headers/header-com/mini-cart'), { ssr: false });

const FloatingCart = () => {
  const { quantity } = useCartInfo();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="header__action" 
           style={{
             position: 'fixed',
             bottom: '30px',
             right: '30px',
             zIndex: 9999,
           }}
      >
        <ul>
          <li 
            className={isOpen ? 'active-cart' : ''} 
            style={{ margin: 0 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button 
              className="cart"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#201f1f',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <i className="ion-bag" style={{ color: '#fff' }}></i>
              {quantity > 0 && (
                <span className="cart-number-2" style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#e32636',
                  color: '#fff',
                  fontSize: '10px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  left: 'auto',
                  padding: 0
                }}>
                  {quantity}
                </span>
              )}
            </button>

            <div className="floating-cart-popup" style={{
              position: 'absolute',
              bottom: '100%',
              right: '0',
              marginBottom: '10px',
              visibility: isOpen ? 'visible' : 'hidden',
              opacity: isOpen ? 1 : 0,
              transition: 'all 0.3s ease-out',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}>
               <MiniCart />
            </div>
          </li>
        </ul>
      </div>

      <style jsx global>{`
        .floating-cart-popup .mini-cart {
          position: static !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 350px !important;
          @media (max-width: 575px) {
            width: 280px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingCart;
