import { TYPE_ICONS, TYPE_LABELS } from '../utils/mockData'

export default function MediaPreviewModal({ item, onClose, onDelete }) {
  if (!item) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📎 {item.name}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="preview-hero">
            <span>{item.emoji || TYPE_ICONS[item.type]}</span>
          </div>
          <div className="preview-details">
            <div className="detail-item"><label>Nom du fichier</label><p>{item.name}</p></div>
            <div className="detail-item"><label>Type</label><p>{TYPE_LABELS[item.type]}</p></div>
            <div className="detail-item"><label>Taille</label><p>{item.size}</p></div>
            <div className="detail-item"><label>Date d'ajout</label><p>{item.date}</p></div>
            <div className="detail-item"><label>Catégorie</label><p>{item.category}</p></div>
            <div className="detail-item"><label>Identifiant</label><p>#{item.id}</p></div>
          </div>
          <div className="preview-actions">
            <button className="btn-action primary">⬇️ Télécharger</button>
            <button className="btn-action primary">✏️ Renommer</button>
            <button className="btn-action danger" onClick={() => { onDelete(item.id); onClose() }}>🗑️ Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
