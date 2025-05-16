import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import TeacherLogin from './pages/TeacherLogin';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Feedback from './pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={user ? (user.role === 'student' ? <Navigate to="/feedback" /> : <Navigate to="/teacher-dashboard" />) : <Login />} 
              />
              <Route 
                path="/teacher-login" 
                element={user ? <Navigate to="/teacher-dashboard" /> : <TeacherLogin />} 
              />
              <Route 
                path="/register" 
                element={user ? (user.role === 'student' ? <Navigate to="/feedback" /> : <Navigate to="/teacher-dashboard" />) : <Register />} 
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/feedback"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute requiredRole="student">
                      <Feedback />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/teacher-dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute requiredRole={['teacher', 'admin']}>
                      <TeacherDashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute requiredRole="admin">
                      <AdminDashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;