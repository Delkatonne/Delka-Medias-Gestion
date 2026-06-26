import { useEffect, useState } from 'react';
import { mediaAPI } from '../services/api';
import { Media } from '../types';
import MediaCard from '../components/MediaCard';

const Dashboard = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    title: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    loadMedias();
  }, []);

  const loadMedias = async () => {
    try {
      setLoading(true);
      const response = await mediaAPI.getAll();
      setMedias(response.data.medias);
    } catch (error) {
      console.error('Load medias error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadMedias();
      return;
    }

    try {
      setLoading(true);
      const response = await mediaAPI.search(searchQuery);
      setMedias(response.data.medias);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) return;

    const formData = new FormData();
    formData.append('file', uploadData.file);
    if (uploadData.title) formData.append('title', uploadData.title);
    if (uploadData.description) formData.append('description', uploadData.description);
    if (uploadData.category) formData.append('category', uploadData.category);

    try {
      setUploadProgress(50);
      await mediaAPI.upload(formData);
      setUploadProgress(100);
      setShowUpload(false);
      setUploadData({ file: null, title: '', description: '', category: '' });
      loadMedias();
      setTimeout(() => setUploadProgress(0), 500);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleDeleteMedia = (id: string) => {
    setMedias(medias.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">📚 Ma Galerie</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher vos médias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              🔍 Rechercher
            </button>
          </form>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {showUpload ? '❌ Fermer' : '➕ Ajouter un média'}
          </button>
        </div>

        {showUpload && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau média</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Titre (optionnel)"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <textarea
                placeholder="Description (optionnelle)"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
                rows={3}
              />
              <input
                type="text"
                placeholder="Catégorie (optionnelle)"
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-green-500 h-2 rounded transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={!uploadData.file}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                📤 Uploader
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="spinner"></div>
            <p className="mt-4">Chargement de vos médias...</p>
          </div>
        ) : (
          <>
            {medias.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">Aucun média trouvé. Commencez par en ajouter un ! 📸</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {medias.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    onDelete={handleDeleteMedia}
                    onUpdate={loadMedias}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;