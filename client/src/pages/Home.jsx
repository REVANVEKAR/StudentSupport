import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import robo from '../assets/robo.png';

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'teacher' || user.role === 'admin') {
        navigate('/teacher-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full bg-[#f7f3ef] flex items-center justify-center overflow-y-hidden">
      <div className="flex flex-row items-center justify-between w-full max-w-6xl px-8">
        <div className="flex-1 flex justify-start items-center">
          <img src={robo} alt="Support Bot" className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] object-contain drop-shadow-xl" />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
            <span className="text-[#e87722]">HEY!</span> <span className="text-black">Lets see what's</span><br />
            <span className="text-black">Worrying You..</span>
          </h1>
          <div className="flex flex-row gap-4 w-full max-w-sm justify-center items-center mb-4">
            <Link
              to="/login"
              className="inline-block w-48 py-3 text-base font-bold rounded-full bg-[#e87722] text-white shadow-md hover:bg-[#d96a1c] transition text-center"
            >
              Student Sign In
            </Link>
            <Link
              to="/teacher-login"
              className="inline-block w-48 py-3 text-base font-bold rounded-full bg-[#e87722] text-white shadow-md hover:bg-[#d96a1c] transition text-center"
            >
              Teacher Sign In
            </Link>
          </div>
          <div className="flex w-full max-w-sm justify-center">
            <Link
              to="/register"
              className="inline-block w-48 py-3 text-base font-bold rounded-full border-2 border-[#e87722] text-[#e87722] bg-white shadow-md hover:bg-[#f7e7d9] transition text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;