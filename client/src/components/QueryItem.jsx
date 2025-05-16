import { useState } from 'react';
import { FaClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

function QueryItem({ query }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'assigned':
        return <FaExclamationCircle className="text-blue-600" />;
      case 'resolved':
        return <FaCheckCircle className="text-green-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md mb-4 overflow-hidden ${expanded ? 'ring-2 ring-primary' : ''}`}>
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 min-w-[100px]">
          {getStatusIcon(query.status)}
          <span className={`text-sm font-medium ${
            query.status === 'pending' ? 'text-yellow-600' :
            query.status === 'assigned' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-800">{query.text}</p>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(query.createdAt)}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 text-sm text-gray-600">
            {query.subject && (
              <div>
                <strong>Subject:</strong> {query.subject.name} ({query.subject.code})
              </div>
            )}
            {query.teacher && (
              <div>
                <strong>Assigned to:</strong> {query.teacher.name}
              </div>
            )}
            <div>
              <strong>Submitted:</strong> {query.isAnonymous ? 'Anonymously' : 'With name'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryItem;