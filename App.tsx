import React, { useState, useEffect, useCallback } from 'react';
import { Developer, Role, FilterState, ToastMessage, ToastType } from './types';
import { fetchDevelopers, createDeveloper, updateDeveloper } from './services/api';
import { DeveloperList } from './components/DeveloperList';
import { FilterBar } from './components/FilterBar';
import { AddDeveloperForm } from './components/AddDeveloperForm';
import { Toast } from './components/Toast';
import { Plus, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

const App: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: '',
    tech: ''
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Toast Handler
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data Fetching
  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDevelopers(filters);
      setDevelopers(data);
    } catch (error) {
      console.error("Failed to fetch developers", error);
      addToast("Failed to connect to backend. Is the server running on port 3001?", ToastType.ERROR);
      setDevelopers([]); 
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    // Debounce search slightly to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      loadDevelopers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadDevelopers]);

  // Handle Save (Create or Update)
  const handleSaveDeveloper = async (data: Omit<Developer, 'id'>) => {
    try {
      if (editingDev) {
        const updated = await updateDeveloper(editingDev.id, data);
        addToast(`Successfully updated ${updated.name}!`, ToastType.SUCCESS);
      } else {
        const created = await createDeveloper(data);
        addToast(`Successfully added ${created.name}!`, ToastType.SUCCESS);
      }
      handleCloseModal();
      loadDevelopers(); // Refresh list
    } catch (error) {
      addToast("Failed to save developer. Please try again.", ToastType.ERROR);
    }
  };

  const handleEditClick = (dev: Developer) => {
    setEditingDev(dev);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDev(null); // Reset editing state
  };

  // Pagination Logic
  const indexOfLastDev = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstDev = indexOfLastDev - ITEMS_PER_PAGE;
  const currentDevelopers = developers.slice(indexOfFirstDev, indexOfLastDev);
  const totalPages = Math.ceil(developers.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">DevDirectory</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Developer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Talent</h2>
          <p className="text-gray-500 mb-6">Browse our directory of skilled developers.</p>
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <DeveloperList developers={currentDevelopers} onEdit={handleEditClick} />
            
            {/* Pagination Controls */}
            {developers.length > 0 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstDev + 1}</span> to <span className="font-medium">{Math.min(indexOfLastDev, developers.length)}</span> of <span className="font-medium">{developers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Simple Page Numbers */}
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      {isModalOpen && (
        <AddDeveloperForm 
          onClose={handleCloseModal} 
          onSubmit={handleSaveDeveloper} 
          initialData={editingDev}
        />
      )}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

export default App;