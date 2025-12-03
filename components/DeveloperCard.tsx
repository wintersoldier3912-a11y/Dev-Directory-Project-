import React from 'react';
import { Developer, Role } from '../types';
import { Code2, Briefcase, User, Pencil, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DeveloperCardProps {
  developer: Developer;
  onEdit: (dev: Developer) => void;
}

const getRoleColor = (role: Role) => {
  switch (role) {
    case Role.FRONTEND:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case Role.BACKEND:
      return 'bg-green-100 text-green-800 border-green-200';
    case Role.FULLSTACK:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full group relative">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(developer);
          }}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          title="Edit Developer"
          aria-label={`Edit ${developer.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{developer.name}</h3>
              <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(developer.role)}`}>
                {developer.role}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
            <span>{developer.experience} {developer.experience === 1 ? 'year' : 'years'} experience</span>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center mb-2 text-sm text-gray-500">
              <Code2 className="w-4 h-4 mr-2" />
              <span>Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {developer.techStack.slice(0, 5).map((tech, index) => (
                <span 
                  key={`${tech}-${index}`} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tech}
                </span>
              ))}
              {developer.techStack.length > 5 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
                  +{developer.techStack.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <Link 
          to={`/developer/${developer.id}`}
          className="text-sm text-indigo-600 font-medium hover:text-indigo-900 transition-colors w-full text-center flex items-center justify-center"
        >
          View Profile <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};