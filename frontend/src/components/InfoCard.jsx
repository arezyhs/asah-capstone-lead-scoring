import React from 'react';

const InfoCard = ({ title, dataObject }) => {
  if (!dataObject) return null;

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-5 flex-1 basis-[48%]">
      <h4 className="text-lg font-semibold text-[#85CC2C] mb-4">{title}</h4>
      {Object.entries(dataObject).map(([key, value]) => (
        <p key={key} className="mb-1 flex justify-between border-b border-dotted border-gray-200 pb-1 text-gray-700">
          <strong className="capitalize text-gray-600">
             {formatKey(key)}:
          </strong> 
          <span>{String(value)}</span>
        </p>
      ))}
    </div>
  );
};

export default InfoCard;