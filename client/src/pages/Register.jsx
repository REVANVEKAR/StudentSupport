import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    srn: '',
    categories: [],
    subjects: [],
    classesTeaching: [],
  });

  const { name, email, password, password2, role, srn, categories } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name === 'categories') {
      const category = e.target.value;
      const isChecked = e.target.checked;
      
      if (isChecked) {
        setFormData((prevState) => ({
          ...prevState,
          categories: [...prevState.categories, category],
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          categories: prevState.categories.filter(cat => cat !== category),
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else if (role === 'student' && !srn) {
      toast.error('SRN is required for students');
    } else if (role === 'teacher' && categories.length === 0) {
      toast.error('Please select at least one category');
    } else {
      const userData = {
        name,
        email,
        password,
        role,
      };

      if (role === 'student') {
        userData.srn = srn;
      } else if (role === 'teacher') {
        userData.categories = categories;
      }

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 flex items-center justify-center">
            <FaUser className="mr-2" /> Student Sign up
        </h1>
          <p className="mt-2 text-center text-gray-600">Please create an account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email ID
              </label>
              <div className="mt-1 relative">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  @reva.edu.in
                </span>
            </div>
          </div>
          
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={onChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          {role === 'student' && (
              <div>
                <label htmlFor="srn" className="block text-sm font-medium text-gray-700">
                  SRN
                </label>
              <input
                type="text"
                id="srn"
                name="srn"
                value={srn}
                placeholder="Enter your SRN (e.g., R21EK031)"
                onChange={onChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
                <p className="mt-1 text-sm text-gray-500">
                  Format: R[year][department][number] (e.g., R21EK031)
                </p>
            </div>
          )}
          
          {role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="academics"
                    name="categories"
                    value="academics"
                    onChange={onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                    <label htmlFor="academics" className="ml-2 block text-sm text-gray-700">
                      Academics
                    </label>
                </div>
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="placements"
                    name="categories"
                    value="placements"
                    onChange={onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                    <label htmlFor="placements" className="ml-2 block text-sm text-gray-700">
                      Placements
                    </label>
                </div>
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sports"
                    name="categories"
                    value="sports"
                    onChange={onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                    <label htmlFor="sports" className="ml-2 block text-sm text-gray-700">
                      Sports
                    </label>
                </div>
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="clubs"
                    name="categories"
                    value="clubs"
                    onChange={onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                    <label htmlFor="clubs" className="ml-2 block text-sm text-gray-700">
                      Clubs
                    </label>
                </div>
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="student_help"
                    name="categories"
                    value="student_help"
                    onChange={onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                    <label htmlFor="student_help" className="ml-2 block text-sm text-gray-700">
                      Student Help
                    </label>
                </div>
              </div>
            </div>
          )}
          
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;