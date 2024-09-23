import React, { useState, useEffect, KeyboardEvent, ReactNode } from 'react';

interface ProtectedPageProps {
  children: ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const response = await fetch('/api/auth', {method: 'GET',});
      const data = await response.json();
      setIsAuthorized(data.success);
    } catch (error) {
      console.error('Error checking authorization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthorized(true);
      } else {
        alert('Mot de passe incorrect');
      }
    } catch (error) {
      console.error('Error submitting password:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="password-layer bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-nightBlue-900">Accès protégé</h2>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mot de passe"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nightBlue-500"
        />
        <button 
          onClick={handlePasswordSubmit}
          className="w-full bg-nightBlue-700 text-white py-2 px-4 rounded-md hover:bg-nightBlue-800 focus:outline-none focus:ring-2 focus:ring-nightBlue-500 focus:ring-opacity-50"
        >
          Entrer
        </button>
      </div>
    </div>
  );
};

export default ProtectedPage;