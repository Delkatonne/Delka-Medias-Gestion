import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">🎬 Delka Médias Gestion</h1>
        <p className="text-xl mb-8">Stockez vos photos, vidéos et documents en toute sécurité</p>
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Photos</h3>
            <p>Stockez et organisez vos photos en toute sécurité</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-bold mb-2">Vidéos</h3>
            <p>Conservez vos vidéos pendant des années</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-2">Documents</h3>
            <p>Archivez vos documents importants</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Connexion
          </Link>
          <Link to="/register" className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;