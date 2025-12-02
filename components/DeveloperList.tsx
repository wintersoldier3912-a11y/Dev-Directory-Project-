import React from 'react';
import { Developer } from '../types';
import { DeveloperCard } from './DeveloperCard';
import { SearchX } from 'lucide-react';

interface DeveloperListProps {
  developers: Developer[];
  onEdit: (dev: Developer) => void;
}

export const DeveloperList: React.FC<DeveloperListProps> = ({ developers, onEdit }) => {
  if (developers.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <SearchX className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No developers found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your filters or add a new developer.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((dev) => (
        <DeveloperCard key={dev.id} developer={dev} onEdit={onEdit} />
      ))}
    </div>
  );
};