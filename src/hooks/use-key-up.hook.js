import { useEffect } from 'react'

export const useKeyUp = (code, callback) => {
  useEffect(() => {
    const handleKeyUp = ev => {
      if (ev.code === code) {
        callback()
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  })
}
