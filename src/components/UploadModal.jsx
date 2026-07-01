import { useRef, useState } from 'react'
import { detectType, formatSize, formatDate, uid } from '../utils/mockData'

export default function UploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState([])
  const fileRef = useRef()

  const simulateUpload = (files) => {
    const items = Array.from(files).map(f => ({
      file: f,
      progress: 0,
      id: uid(),
    }))
    setUploads(items)

    items.forEach(item => {
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 25 + 5
        if (p >= 100) {
          p = 100
          clearInterval(interval)
          setTimeout(() => {
            const type = detectType(item.file.name)
            onUpload({
              id: uid(),
              name: item.file.name,
              type,
              size: formatSize(item.file.size),
              date: formatDate(),
              category: 'Nouveau',
              emoji: type === 'photo' ? '🖼️' : type === 'video' ? '🎬' : '📄',
              starred: false,
            })
          }, 300)
        }
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress: Math.min(p, 100) } : u))
      }, 150)
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📤 Ajouter des médias</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); simulateUpload(e.dataTransfer.files) }}
            onClick={() => fileRef.current.click()}
          >
            <div className="drop-zone-icon">📂</div>
            <div className="drop-zone-title">Glissez vos fichiers ici</div>
            <div className="drop-zone-sub">Photos, vidéos, documents · Tous formats acceptés</div>
            <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={e => simulateUpload(e.target.files)} />
          </div>

          {uploads.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.85rem' }}>Importation en cours…</div>
              {uploads.map(u => (
                <div key={u.id} className="upload-progress">
                  <div className="upload-progress-icon">
                    {u.file.name.endsWith('.pdf') ? '📄' : u.file.name.match(/\.(jpg|png|jpeg|gif)$/i) ? '🖼️' : '🎬'}
                  </div>
                  <div className="upload-progress-info">
                    <div className="upload-progress-name">{u.file.name}</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: u.progress + '%' }} /></div>
                  </div>
                  <div className="upload-progress-pct">{u.progress === 100 ? '✅' : Math.round(u.progress) + '%'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
