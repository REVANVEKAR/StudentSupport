import React from 'react';

function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="w-16 h-16 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;