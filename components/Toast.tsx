import React from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const isSuccess = message.type === ToastType.SUCCESS;
  
  return (
    <div 
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all transform ease-out duration-300 ${
        isSuccess ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isSuccess ? (
              <CheckCircle className="h-6 w-6 text-green-400" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{isSuccess ? 'Success' : 'Error'}</p>
            <p className="mt-1 text-sm text-gray-500">{message.message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};