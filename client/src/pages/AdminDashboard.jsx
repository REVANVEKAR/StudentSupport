import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../components/Spinner';
import TeacherQueryItem from '../components/TeacherQueryItem';
import {
  FaFilter,
  FaSearch,
  FaPlus,
  FaUpload,
  FaDatabase,
  FaUsers,
  FaBook,
} from 'react-icons/fa';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('queries');
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // Subject form
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    department: '',
    semester: '',
  });
  
  // Document upload
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (activeTab === 'queries') {
      fetchQueries();
    } else if (activeTab === 'teachers') {
      fetchTeachers();
    } else if (activeTab === 'subjects' || activeTab === 'upload') {
      fetchSubjects();
    }
  }, [activeTab]);

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

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/users/teachers', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTeachers(response.data);
    } catch (error) {
      toast.error('Error fetching teachers');
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

  const filterQueries = () => {
    let filtered = [...queries];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(query => query.status === statusFilter);
    }

    // Filter by subject
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(query => 
        query.subject && query.subject._id === subjectFilter
      );
    }

    // Filter by search term
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

  const handleAssignTeacher = async (queryId, teacherId) => {
    try {
      const response = await axios.put(
        `/api/queries/${queryId}/assign`,
        { teacherId },
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
      
      toast.success('Teacher assigned successfully');
    } catch (error) {
      toast.error('Error assigning teacher');
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

  const handleSubjectChange = (e) => {
    setNewSubject({
      ...newSubject,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSubject.name || !newSubject.code || !newSubject.department || !newSubject.semester) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      await axios.post('/api/subjects', newSubject, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      toast.success('Subject added successfully');
      setNewSubject({
        name: '',
        code: '',
        department: '',
        semester: '',
      });
      fetchSubjects();
    } catch (error) {
      toast.error('Error adding subject');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedFile) {
      toast.error('Please select both subject and file');
      return;
    }
    
    const formData = new FormData();
    formData.append('document', selectedFile);
    
    try {
      await axios.post(`/api/uploads/subject/${selectedSubject}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      toast.success('Document uploaded successfully');
      setSelectedSubject('');
      setSelectedFile(null);
      // Reset file input
      document.getElementById('document-upload').value = '';
    } catch (error) {
      toast.error('Error uploading document');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => setActiveTab('queries')}
        >
          <FaDatabase /> Queries
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <FaUsers /> Teachers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          <FaBook /> Subjects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <FaUpload /> Upload Documents
        </button>
      </div>

      <div className="admin-content">
        {/* Queries Tab */}
        {activeTab === 'queries' && (
          <>
            <div className="filters-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-options">
                <div className="filter-group">
                  <label><FaFilter /> Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label><FaFilter /> Subject:</label>
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                    <option value="non-academic">Non-Academic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="queries-list admin-queries">
              <h2>All Queries</h2>
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <TeacherQueryItem
                    key={query._id}
                    query={query}
                    onResponseSubmit={handleResponseSubmit}
                    teachers={teachers}
                    showAssign={query.status === 'pending'}
                    onAssign={handleAssignTeacher}
                    isAdmin={true}
                  />
                ))
              ) : (
                <p className="no-queries">No queries found matching your filters.</p>
              )}
            </div>
          </>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="teachers-container">
            <h2>Teachers</h2>
            <div className="teachers-list">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <div key={teacher._id} className="teacher-card">
                    <h3>{teacher.name}</h3>
                    <p><strong>Email:</strong> {teacher.email}</p>
                    <p><strong>Subjects:</strong></p>
                    <ul className="teacher-subjects">
                      {teacher.subjects && teacher.subjects.length > 0 ? (
                        teacher.subjects.map((subject, index) => (
                          <li key={index}>{subject}</li>
                        ))
                      ) : (
                        <li>No subjects assigned</li>
                      )}
                    </ul>
                    <p><strong>Categories:</strong></p>
                    <ul className="teacher-categories">
                      {teacher.categories && teacher.categories.length > 0 ? (
                        teacher.categories.map((category, index) => (
                          <li key={index}>{category.replace('_', ' ')}</li>
                        ))
                      ) : (
                        <li>No categories assigned</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No teachers found.</p>
              )}
            </div>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="subjects-container">
            <div className="subjects-header">
              <h2>Manage Subjects</h2>
            </div>
            
            <div className="add-subject-form">
              <h3><FaPlus /> Add New Subject</h3>
              <form onSubmit={handleSubjectSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Subject Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newSubject.name}
                    onChange={handleSubjectChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="code">Subject Code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={newSubject.code}
                    onChange={handleSubjectChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={newSubject.department}
                    onChange={handleSubjectChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="EF">Computer Science (EF)</option>
                    <option value="EH">AI & Data Science (EH)</option>
                    <option value="EQ">Information Science (EQ)</option>
                    <option value="EJ">CS & IT (EJ)</option>
                    <option value="EK">Computer Science & Systems (EK)</option>
                    <option value="EA">AI & ML (EA)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    value={newSubject.semester}
                    onChange={handleSubjectChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Add Subject
                </button>
              </form>
            </div>
            
            <div className="subjects-list">
              <h3>Current Subjects</h3>
              {subjects.length > 0 ? (
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject._id}>
                        <td>{subject.name}</td>
                        <td>{subject.code}</td>
                        <td>{subject.department}</td>
                        <td>{subject.semester}</td>
                        <td>{subject.documents ? subject.documents.length : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No subjects found.</p>
              )}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="upload-container">
            <h2><FaUpload /> Upload Subject Documents</h2>
            <p className="upload-info">
              Upload PDF documents for subjects to train the NLP system for better query routing.
              Each document will be processed to extract keywords related to the subject.
            </p>
            
            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="subject-select">Select Subject</label>
                <select
                  id="subject-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  <option value="">Select a Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="document-upload">Upload Document (PDF only)</label>
                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                <FaUpload /> Upload Document
              </button>
            </form>
            
            <div className="manual-process">
              <h3>Alternative: Process Documents Folder</h3>
              <p>
                You can also process documents by placing them in folders inside the <code>subjects/</code> directory,
                and then running the processing script.
              </p>
              <ol>
                <li>Create a folder in <code>subjects/</code> with the subject name (e.g., <code>subjects/Database_Systems/</code>)</li>
                <li>Place PDF documents related to the subject in the folder</li>
                <li>Run <code>npm run process-docs</code> to process all documents and extract keywords</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;