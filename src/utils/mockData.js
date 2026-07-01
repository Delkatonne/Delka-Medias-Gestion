export const TYPE_ICONS  = { photo: '🖼️', video: '🎬', doc: '📄' }
export const TYPE_LABELS = { photo: 'Photo', video: 'Vidéo', doc: 'Document' }
export const TYPE_BADGE  = { photo: 'type-photo', video: 'type-video', doc: 'type-doc' }

export const INITIAL_MEDIA = [
  { id: 1,  name: 'Famille_Noël_2023.jpg',        type: 'photo', size: '3.2 MB',  date: '25 déc. 2023', category: 'Famille',        emoji: '🌅', starred: false },
  { id: 2,  name: 'Mariage_Sophie.mp4',            type: 'video', size: '245 MB', date: '14 fév. 2024', category: 'Événements',      emoji: '💒', starred: true  },
  { id: 3,  name: 'Contrat_maison.pdf',            type: 'doc',   size: '1.4 MB', date: '3 jan. 2024',  category: 'Documents',       emoji: '📄', starred: false },
  { id: 4,  name: 'Vacances_Bénin.jpg',            type: 'photo', size: '5.1 MB', date: '20 août 2023', category: 'Voyages',         emoji: '🏖️', starred: false },
  { id: 5,  name: 'Diplôme_Licence.pdf',           type: 'doc',   size: '0.8 MB', date: '30 juin 2023', category: 'Académique',      emoji: '🎓', starred: true  },
  { id: 6,  name: 'Anniversaire_Papa.mp4',         type: 'video', size: '89 MB',  date: '12 mar. 2024', category: 'Famille',         emoji: '🎂', starred: false },
  { id: 7,  name: 'Photo_profil_pro.jpg',          type: 'photo', size: '1.1 MB', date: '5 jan. 2024',  category: 'Professionnel',   emoji: '👤', starred: false },
  { id: 8,  name: 'Passeport_scan.pdf',            type: 'doc',   size: '2.3 MB', date: '10 fév. 2024', category: 'Documents',       emoji: '📋', starred: true  },
  { id: 9,  name: 'Coucher_soleil_Cotonou.jpg',   type: 'photo', size: '4.7 MB', date: '18 avr. 2024', category: 'Voyages',         emoji: '🌇', starred: false },
  { id: 10, name: 'Présentation_projet.mp4',       type: 'video', size: '320 MB', date: '2 mai 2024',   category: 'Professionnel',   emoji: '🎬', starred: false },
  { id: 11, name: 'Naissance_bébé.jpg',            type: 'photo', size: '6.8 MB', date: '22 nov. 2023', category: 'Famille',         emoji: '👶', starred: true  },
  { id: 12, name: 'Acte_naissance.pdf',            type: 'doc',   size: '0.5 MB', date: '1 jan. 2020',  category: 'Académique',      emoji: '📜', starred: false },
]

/** Detect file type from extension */
export function detectType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (['jpg','jpeg','png','gif','webp','heic','bmp','svg'].includes(ext)) return 'photo'
  if (['mp4','mov','avi','mkv','webm','flv'].includes(ext)) return 'video'
  return 'doc'
}

/** Format bytes to human-readable */
export function formatSize(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576)    return (bytes / 1048576).toFixed(1)    + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

/** Format date to French locale */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Generate a unique ID */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}
