import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title, description, icon = '🚧' }) => {
  return (
    <div className="card text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Construction className="h-4 w-4" />
        This feature is under development
      </div>
    </div>
  );
};

export default Placeholder; 