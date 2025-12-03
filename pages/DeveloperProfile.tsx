import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDeveloperById, deleteDeveloper } from '../services/api';
import { Developer, Role } from '../types';
import { ArrowLeft, Calendar, Trash2, User, Code2, Briefcase, Clock, FileText } from 'lucide-react';

export const DeveloperProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadDev = async () => {
      if (!id) return;
      try {
        const data = await fetchDeveloperById(id);
        setDeveloper(data);
      } catch (err) {
        setError('Failed to load developer profile');
      } finally {
        setLoading(false);
      }
    };
    loadDev();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDeveloper(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete developer');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (error || !developer) return <div className="p-8 text-center text-red-600">{error || 'Developer not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 sm:px-10 flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="ml-5 text-white">
              <h1 className="text-2xl font-bold">{developer.name}</h1>
              <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20">
                {developer.role}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors"
            title="Delete Developer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 sm:px-10 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center text-gray-500 mb-1">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Experience</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{developer.experience} Years</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Joined</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {developer.joiningDate ? new Date(developer.joiningDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {developer.createdAt ? new Date(developer.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
              <FileText className="w-5 h-5 mr-2 text-gray-400" />
              About
            </h3>
            <p className="text-gray-600 leading-relaxed bg-white border border-gray-100 p-4 rounded-lg">
              {developer.about || "No bio provided."}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
              <Code2 className="w-5 h-5 mr-2 text-gray-400" />
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {developer.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Developer</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {developer.name}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};