import React from 'react';
const SkeletonProduct = () => (
  <div className="border rounded p-2 shadow animate-pulse">
    <div className="w-full h-36 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded mt-1 w-1/2"></div>
  </div>
);
export default SkeletonProduct;