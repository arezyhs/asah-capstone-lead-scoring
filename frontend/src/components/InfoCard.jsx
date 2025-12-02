import React from 'react';

const InfoCard = ({ title, dataObject }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm flex-1 basis-[48%] min-w-[300px] transition-colors duration-300">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2">
        {title}
      </h4>
      <div className="space-y-3">
        {Object.entries(dataObject).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{key}</span>
            <span className="text-gray-800 dark:text-gray-100 font-semibold text-right max-w-[60%] truncate">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;