import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Developer, FilterState, ToastMessage, ToastType } from './types';
import { fetchDevelopers, createDeveloper, updateDeveloper } from './services/api';
import { DeveloperList } from './components/DeveloperList';
import { FilterBar } from './components/FilterBar';
import { AddDeveloperForm } from './components/AddDeveloperForm';
import { Toast } from './components/Toast';
import { Plus, Terminal, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DeveloperProfile } from './pages/DeveloperProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

const ITEMS_PER_PAGE = 9;

// Dashboard Component (The main list view)
const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: '',
    tech: '',
    sort: 'newest',
    page: 1
  });

  // Toast Handler
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
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
      const response = await fetchDevelopers(filters);
      setDevelopers(response.data);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Failed to fetch developers", error);
      addToast("Failed to fetch data.", ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDevelopers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadDevelopers]);

  // Handle Save
  const handleSaveDeveloper = async (data: Omit<Developer, 'id'>) => {
    try {
      if (editingDev) {
        await updateDeveloper(editingDev.id, data);
        addToast(`Updated successfully!`, ToastType.SUCCESS);
      } else {
        await createDeveloper(data);
        addToast(`Added successfully!`, ToastType.SUCCESS);
      }
      handleCloseModal();
      loadDevelopers();
    } catch (error) {
      addToast("Failed to save. Please try again.", ToastType.ERROR);
    }
  };

  const handleEditClick = (dev: Developer) => {
    setEditingDev(dev);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDev(null);
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500 hidden sm:block">Welcome, {user?.name}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Developer</span>
            </button>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
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
            <DeveloperList developers={developers} onEdit={handleEditClick} />
            
            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setFilters(prev => ({...prev, page: Math.max(prev.page - 1, 1)}))}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({...prev, page: Math.min(prev.page + 1, totalPages)}))}
                    disabled={filters.page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(filters.page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(filters.page * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setFilters(prev => ({...prev, page: Math.max(prev.page - 1, 1)}))}
                        disabled={filters.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Simple Page Numbers Logic */}
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setFilters(prev => ({...prev, page: pageNum}))}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                filters.page === pageNum
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === filters.page - 2 ||
                          pageNum === filters.page + 2
                        ) {
                          return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setFilters(prev => ({...prev, page: Math.min(prev.page + 1, totalPages)}))}
                        disabled={filters.page === totalPages}
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

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/developer/:id" element={<DeveloperProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;