
import React, { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: ReactNode;
  onClick: () => void;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  buttonText, 
  icon,
  onClick,
  color 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-800';
      case 'green':
        return 'bg-green-50 text-green-800';
      case 'orange':
        return 'bg-orange-50 text-orange-800';
      case 'purple':
        return 'bg-purple-50 text-purple-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };
  
  const getButtonClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };
  
  return (
    <div className={`action-card ${getColorClasses()}`}>
      <div className="mb-4 p-2 rounded-md bg-white bg-opacity-50">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      <p className="text-sm mb-4 opacity-80">{description}</p>
      
      <button 
        onClick={onClick}
        className={`w-full py-2 rounded-md text-center text-sm font-medium ${getButtonClasses()}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionCard;
