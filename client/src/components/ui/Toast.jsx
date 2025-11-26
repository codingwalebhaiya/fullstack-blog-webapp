// components/ui/Toast.jsx
const Toast = ({ show, message, type = 'error', onClose }) => {
  if (!show) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${styles[type]} border rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;