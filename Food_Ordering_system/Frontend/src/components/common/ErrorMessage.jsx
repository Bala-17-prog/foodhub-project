import { FaExclamationCircle } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <FaExclamationCircle className="text-red-500 text-4xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-4 text-center">{message || 'An error occurred'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
