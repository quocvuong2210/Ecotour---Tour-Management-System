import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

function AuthModal({ isOpen, onClose }) {
  const [showRegister, setShowRegister] = useState(false);

  React.useEffect(() => {
    const handleAuthSuccess = () => {
      onClose();
    };
    
    window.addEventListener('auth-success', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default AuthModal;

