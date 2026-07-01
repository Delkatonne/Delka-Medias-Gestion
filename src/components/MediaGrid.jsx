import MediaCard from './MediaCard'

export default function MediaGrid({ items, viewMode, onOpen, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <div className="empty-title">Aucun fichier trouvé</div>
        <div className="empty-text">Ajoutez vos premières photos, vidéos ou documents.</div>
      </div>
    )
  }

  return (
    <div className={`media-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
      {items.map(item => (
        <MediaCard key={item.id} item={item} viewMode={viewMode} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  )
}
