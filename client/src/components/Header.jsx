import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout, reset } from '../features/auth/authSlice';
import revalogo from '../assets/revalogo.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="bg-[#f7f3ef] shadow-sm w-full">
      <div className="flex justify-between items-center h-24 max-w-full px-0">
        <div className="flex items-center h-full pl-2">
          <Link to="/">
            <img src={revalogo} alt="REVA University Logo" className="h-20 w-auto object-contain" />
          </Link>
        </div>
        <nav className="flex items-center space-x-14 pr-12">
          <Link to="/" className={`text-black hover:text-[#e87722] font-semibold text-2xl${location.pathname === '/' ? ' underline underline-offset-8 decoration-[#e87722]' : ''}`}>Home</Link>
          <Link to="/about" className={`text-black hover:text-[#e87722] font-semibold text-2xl${location.pathname === '/about' ? ' underline underline-offset-8 decoration-[#e87722]' : ''}`}>About</Link>
          {(!user || user.role === 'student') && (
            <Link to="/feedback" className={`text-black hover:text-[#e87722] font-semibold text-2xl${location.pathname === '/feedback' ? ' underline underline-offset-8 decoration-[#e87722]' : ''}`}>Feedback</Link>
          )}
          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center text-black hover:text-[#e87722] font-semibold text-2xl"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Header;