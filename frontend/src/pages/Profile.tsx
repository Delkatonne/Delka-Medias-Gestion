import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { userAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(formData.firstName, formData.lastName);
      setUser(response.data.user);
      setMessage('Profil mis à jour avec succès!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Mot de passe changé avec succès!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Entrez votre mot de passe pour confirmer la suppression du compte:');
    if (!password) return;

    try {
      await userAPI.deleteAccount(password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">👤 Mon Profil</h1>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{message}</div>}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profil */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Informations Personnelles</h2>
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="Prénom"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="Nom"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Nom:</strong> {user?.firstName} {user?.lastName}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                >
                  ✏️ Modifier
                </button>
              </>
            )}
          </div>

          {/* Changement de mot de passe */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Changer le Mot de Passe</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mot de passe actuel"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                Mettre à jour
              </button>
            </form>
          </div>
        </div>

        {/* Supprimer le compte */}
        <div className="bg-red-50 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Zone de Danger</h2>
          <p className="text-gray-600 mb-4">La suppression de votre compte est permanente et irréversible.</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            🗑️ Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;