import React from 'react';

interface ProgressBarProps {
  total: number;
  assessed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, assessed }) => {
  const percentage = total > 0 ? (assessed / total) * 100 : 0;
  
  return (
    <div className="relative w-full bg-gray-200 rounded h-6">
      <div
        className="bg-green-500 h-full rounded transition-width duration-200"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
        {assessed}/{total}
      </span>
    </div>
  );
};

export default ProgressBar;
