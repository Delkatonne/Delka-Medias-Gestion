import { createContext, useContext, useState } from 'react'
import { INITIAL_MEDIA } from '../utils/mockData'

const MediaContext = createContext(null)

export function MediaProvider({ children }) {
  const [media, setMedia] = useState(INITIAL_MEDIA)

  const addMedia = (item) => {
    setMedia(prev => [item, ...prev])
  }

  const deleteMedia = (id) => {
    setMedia(prev => prev.filter(m => m.id !== id))
  }

  const renameMedia = (id, newName) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, name: newName } : m))
  }

  const toggleStar = (id) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  const photos    = media.filter(m => m.type === 'photo')
  const videos    = media.filter(m => m.type === 'video')
  const docs      = media.filter(m => m.type === 'doc')
  const starred   = media.filter(m => m.starred)

  return (
    <MediaContext.Provider value={{ media, photos, videos, docs, starred, addMedia, deleteMedia, renameMedia, toggleStar }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used inside MediaProvider')
  return ctx
}
