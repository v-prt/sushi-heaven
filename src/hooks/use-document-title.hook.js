import { useEffect } from 'react'

export const useDocumentTitle = (title, fallbackTitle) => {
  useEffect(() => {
    document.title = `${title}`
    return () => {
      document.title = `${fallbackTitle}`
    }
  })
}
