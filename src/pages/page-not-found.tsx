import React, { useEffect } from 'react';

export default function PageNotFound() {
  useEffect(() => {
    document.title = 'Instagram - Not Found!';
  }, []);

  return (
    <div>
      <div>
        <p>Not Found!</p>
      </div>
    </div>
  );
}
