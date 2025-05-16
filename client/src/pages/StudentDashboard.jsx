import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../components/Spinner';
import QueryItem from '../components/QueryItem';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import robo from '../assets/robo.png';

function StudentDashboard() {
  const [queryText, setQueryText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new');

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/queries/my-queries', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setQueries(response.data);
    } catch (error) {
      toast.error('Error fetching queries');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!queryText) {
      toast.error('Please enter a query');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/queries',
        { text: queryText, isAnonymous },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      setQueries([response.data, ...queries]);
      setQueryText('');
      setIsAnonymous(false);
      toast.success('Query submitted successfully');
      setActiveTab('history');
    } catch (error) {
      toast.error('Error submitting query');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Hi! {user.name}</h1>
        <p className="srn-display">{user.srn}</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Query
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Query History ({queries.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'new' ? (
          <div className="query-form-container">
            <div className="bot-container">
              <div className="bot-avatar">
                <img src={robo} alt="Bot" />
              </div>
              <div className="bot-message">
                <p>Hey! Please drop your complaint below..</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="query-form">
              <div className="form-group query-input-group">
                <input
                  type="text"
                  className="form-control query-input"
                  id="queryText"
                  name="queryText"
                  value={queryText}
                  placeholder="Type your query here..."
                  onChange={(e) => setQueryText(e.target.value)}
                />
                <button type="submit" className="btn query-submit-btn">
                  <FaPaperPlane />
                </button>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isAnonymous">
                  Submit anonymously
                </label>
              </div>
            </form>
          </div>
        ) : (
          <div className="queries-list">
            <h2>Your Queries</h2>
            {queries.length > 0 ? (
              queries.map((query) => (
                <QueryItem key={query._id} query={query} />
              ))
            ) : (
              <p className="no-queries">You haven't submitted any queries yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;