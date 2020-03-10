import React from 'react';

export default function useDocumentTitle({ title, fallbackTitle }) {
  React.useEffect(() => {
    document.title = title;

    return () => {
      document.title = fallbackTitle;
    };
  }, [title, fallbackTitle]);
}
