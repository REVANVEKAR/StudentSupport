import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../components/Spinner';
import TeacherQueryItem from '../components/TeacherQueryItem';
import {
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaPlus,
} from 'react-icons/fa';

function TeacherDashboard() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // Subject management state
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [teachingSubjects, setTeachingSubjects] = useState([]);

  // CR management state
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [crMap, setCrMap] = useState({});

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchQueries();
    fetchSubjects();
    fetchTeachingSubjects();
    fetchCrMap();
  }, []);

  useEffect(() => {
    filterQueries();
  }, [queries, searchTerm, statusFilter, subjectFilter]);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/queries', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setQueries(response.data);
      setFilteredQueries(response.data);
    } catch (error) {
      toast.error('Error fetching queries');
    }
    setIsLoading(false);
  };

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      toast.error('Error fetching subjects');
    }
    setIsLoading(false);
  };

  const fetchTeachingSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTeachingSubjects(response.data.classesTeaching || []);
    } catch (error) {
      console.error('Error fetching teaching subjects:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'Error fetching teaching subjects');
      } else {
        toast.error('Error fetching teaching subjects');
      }
      setTeachingSubjects([]);
    }
    setIsLoading(false);
  };

  const fetchCrMap = async () => {
    try {
      const response = await axios.get('/api/subjects/classes');
      setCrMap(response.data || {});
    } catch (error) {
      toast.error('Error fetching CR mappings');
      setCrMap({});
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    if (!selectedSemester || !selectedSubject) {
      toast.error('Please select both semester and subject');
      return;
    }

    try {
      const response = await axios.put(
        `/api/users/${user._id}`,
        {
          classesTeaching: [
            ...teachingSubjects,
            {
              subject: selectedSubject,
              semester: parseInt(selectedSemester),
              section: 'A' // Default section, can be made dynamic if needed
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTeachingSubjects(response.data.classesTeaching);
      setSelectedSemester('');
      setSelectedSubject('');
      toast.success('Subject added successfully');
    } catch (error) {
      toast.error('Error adding subject');
    }
  };

  const handleAddCr = async (e) => {
    e.preventDefault();
    if (!department || !semester || !section) {
      toast.error('Please enter department, semester, and section');
      return;
    }
    try {
      const response = await axios.post('/api/subjects/classes', {
        department,
        semester,
        section,
        teacherId: user._id,
      });
      setCrMap(response.data.crMap);
      setDepartment('');
      setSemester('');
      setSection('');
      toast.success('You are now the CR for this class/department/section!');
    } catch (error) {
      toast.error('Error setting CR');
    }
  };

  const handleRemoveSubject = async (index) => {
    try {
      const updatedSubjects = teachingSubjects.filter((_, i) => i !== index);
      
      const response = await axios.put(
        `/api/users/${user._id}`,
        {
          classesTeaching: updatedSubjects
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTeachingSubjects(response.data.classesTeaching);
      toast.success('Subject removed successfully');
    } catch (error) {
      toast.error('Error removing subject');
    }
  };

  const handleResponseSubmit = async (queryId, responseText) => {
    try {
      const response = await axios.post(
        `/api/queries/${queryId}/responses`,
        { text: responseText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update the queries list
      setQueries(
        queries.map(query =>
          query._id === queryId ? response.data : query
        )
      );
      
      toast.success('Response submitted successfully');
    } catch (error) {
      toast.error('Error submitting response');
    }
  };

  const filterQueries = () => {
    let filtered = [...queries];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(query => query.status === statusFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(query => 
        query.subject && query.subject._id === subjectFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        query =>
          query.text.toLowerCase().includes(term) ||
          (query.student && query.student.name && query.student.name.toLowerCase().includes(term)) ||
          (query.student && query.student.srn && query.student.srn.toLowerCase().includes(term))
      );
    }

    setFilteredQueries(filtered);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user.name}</p>
        </div>

        {/* CR Management Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Class Representative (CR) Management</h2>
            <form onSubmit={handleAddCr} className="mb-4 flex flex-col md:flex-row gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="EK">CSSE (EK)</option>
                  <option value="EQ">ISE (EQ)</option>
                  <option value="EF">CSE (EF)</option>
                  <option value="EH">AIDS (EH)</option>
                  <option value="EJ">CS & IT (EJ)</option>
                  <option value="EA">AIML (EA)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., A"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Become CR
              </button>
            </form>
          </div>
        </div>

        {/* Subject Management Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Teaching Subjects</h2>
            
            <form onSubmit={handleAddSubject} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" />
                    Add Subject
                  </button>
                </div>
              </div>
            </form>

            {/* Current Teaching Subjects */}
            <div>
              <h3 className="text-lg font-medium mb-4">Current Teaching Subjects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachingSubjects.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{subject.subject}</p>
                      <p className="text-sm text-gray-600">
                        Semester {subject.semester}, Section {subject.section}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveSubject(index)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Queries Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Assigned Queries</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FaClock className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Pending</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {queries.filter(q => q.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaExclamationCircle className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Assigned</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {queries.filter(q => q.status === 'assigned').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {queries.filter(q => q.status === 'resolved').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Queries List */}
            <div>
              {filteredQueries.length > 0 ? (
                <div className="space-y-4">
                  {filteredQueries.map((query) => (
                    <TeacherQueryItem
                      key={query._id}
                      query={query}
                      onResponseSubmit={handleResponseSubmit}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No queries found matching your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;