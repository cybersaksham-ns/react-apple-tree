import React from 'react';

function Triangle({ height = '8', width = '8' }) {
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.636 7.0384C4.2864 7.644 3.7136 7.644 3.364 7.0384L0.229598 1.6088C-0.120002 1.0032 0.165598 0.507202 0.865598 0.507202H7.1352C7.8352 0.507202 8.1208 1.0032 7.7712 1.6088L4.636 7.0384Z"
        fill="black"
      />
    </svg>
  );
}

export default Triangle;
