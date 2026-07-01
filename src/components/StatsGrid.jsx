import { useMedia } from '../context/MediaContext'

export default function StatsGrid() {
  const { media, photos, videos, docs } = useMedia()
  const totalSizeMB = 1240

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🖼️</div>
        <div className="stat-value">{photos.length}</div>
        <div className="stat-label">Photos</div>
        <div className="stat-accent">Sauvegardées</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🎬</div>
        <div className="stat-value">{videos.length}</div>
        <div className="stat-label">Vidéos</div>
        <div className="stat-accent">Sauvegardées</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📄</div>
        <div className="stat-value">{docs.length}</div>
        <div className="stat-label">Documents</div>
        <div className="stat-accent">Sécurisés</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-value">{media.length}</div>
        <div className="stat-label">Total fichiers</div>
        <div className="stat-accent">{(totalSizeMB / 1024).toFixed(1)} GB utilisés</div>
      </div>
    </div>
  )
}
