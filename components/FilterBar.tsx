import React from 'react';
import { FilterState, ROLES } from '../types';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const handleChange = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
      search: '',
      role: '',
      tech: '',
      sort: 'newest',
      page: 1
    });
  };

  const hasActiveFilters = filters.search !== '' || filters.tech !== '' || filters.role !== '' || filters.sort !== 'newest';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 lg:items-center">
      {/* Search Name */}
      <div className="flex-1 relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        />
      </div>

      {/* Tech Stack Filter */}
      <div className="flex-1 relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Filter by tech..."
          value={filters.tech}
          onChange={(e) => handleChange('tech', e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        />
      </div>

      {/* Role Dropdown */}
      <div className="w-full lg:w-40">
        <select
          value={filters.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors"
        >
          <option value="">All Roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

       {/* Sort Dropdown */}
       <div className="w-full lg:w-48 relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
         </div>
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="block w-full pl-9 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors"
        >
          <option value="newest">Newest First</option>
          <option value="experience_desc">Exp: High to Low</option>
          <option value="experience_asc">Exp: Low to High</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="w-full lg:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex-shrink-0"
        >
          <X className="h-4 w-4 mr-2 text-gray-500" />
          Clear All Filters
        </button>
      )}
    </div>
  );
};