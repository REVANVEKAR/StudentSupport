import { useState } from 'react';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaReply, FaUserAlt } from 'react-icons/fa';

function TeacherQueryItem({ 
  query, 
  onResponseSubmit, 
  teachers, 
  showAssign = false, 
  onAssign,
  isAdmin = false 
}) {
  const [expanded, setExpanded] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

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

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    
    if (!responseText.trim()) {
      return;
    }
    
    onResponseSubmit(query._id, responseText);
    setResponseText('');
  };

  const handleAssignTeacher = (e) => {
    e.preventDefault();
    
    if (!selectedTeacher) {
      return;
    }
    
    onAssign(query._id, selectedTeacher);
    setSelectedTeacher('');
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
        <div className="flex flex-col items-end gap-2 min-w-[200px]">
          {!query.isAnonymous && query.student && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUserAlt /> {query.student.name} {query.student.srn && `(${query.student.srn})`}
            </div>
          )}
          {query.isAnonymous && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUserAlt /> Anonymous
            </div>
          )}
          <div className="text-sm text-gray-500">
            {formatDate(query.createdAt)}
          </div>
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
            {query.category && (
              <div>
                <strong>Category:</strong> {query.category.replace('_', ' ')}
              </div>
            )}
          </div>
          
          {showAssign && isAdmin && teachers && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium mb-2">Assign to Teacher</h4>
              <form onSubmit={handleAssignTeacher} className="flex gap-2">
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Assign
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
              <FaReply /> Response
            </h4>
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response..."
                className="w-full min-h-[100px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Submit Response
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherQueryItem;