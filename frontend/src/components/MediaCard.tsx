import { Media } from '../types';
import { useState } from 'react';
import { mediaAPI } from '../services/api';

interface MediaCardProps {
  media: Media;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const MediaCard = ({ media, onDelete, onUpdate }: MediaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(media.title || '');
  const [description, setDescription] = useState(media.description || '');
  const [category, setCategory] = useState(media.category || '');

  const handleUpdate = async () => {
    try {
      await mediaAPI.update(media.id, title, description, media.tags, category);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      try {
        await mediaAPI.delete(media.id);
        onDelete(media.id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const isImage = media.mimetype.startsWith('image/');
  const isVideo = media.mimetype.startsWith('video/');
  const isDocument = media.mimetype === 'application/pdf' || media.mimetype.includes('document');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {isImage && <img src={media.filepath} alt={media.title} className="w-full h-48 object-cover" />}
      {isVideo && (
        <video className="w-full h-48 object-cover">
          <source src={media.filepath} type={media.mimetype} />
        </video>
      )}
      {isDocument && (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
      )}
      {!isImage && !isVideo && !isDocument && (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">📁</span>
        </div>
      )}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              rows={2}
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 text-black py-1 rounded text-sm hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-2">{title || media.originalName}</h3>
            {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
            {category && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">{category}</span>}
            <p className="text-xs text-gray-500 mb-3">
              {new Date(media.createdAt).toLocaleDateString('fr-FR')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-yellow-500 text-white py-1 rounded text-sm hover:bg-yellow-600"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600"
              >
                🗑️ Supprimer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaCard;