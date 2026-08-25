import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, register } from '../api/authApi';
import { getCurrentUser } from '../api/customerApi';

const roleRoutes = {
  CUSTOMER: '/customer',
  VENDOR: '/vendor',
  ADMIN: '/admin',
};

const authMessage = {
  CUSTOMER: 'Customer access for orders, cart, and account tasks.',
  VENDOR: 'Vendor access for product management and sales activity.',
  ADMIN: 'Admin access for system monitoring and user management.',
};

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(location.search).get('tab') === 'register' ? 'register' : 'login'
  );

  useEffect(() => {
    const nextTab = new URLSearchParams(location.search).get('tab') === 'register' ? 'register' : 'login';
    setActiveTab(nextTab);
  }, [location.search]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const getRegisterPayload = () => ({
    ...registerForm,
    role: 'CUSTOMER',
  });

  const getRoleFromResponse = (responseData) => {
    const role =
      responseData?.role ||
      responseData?.data?.role ||
      responseData?.user?.role ||
      localStorage.getItem('role') ||
      'CUSTOMER';

    return String(role).toUpperCase();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(loginForm);
      const token =
        response?.data?.token ||
        response?.data?.data?.token ||
        response?.data?.accessToken;

      if (!token) {
        alert('Login failed: no token returned by backend.');
        return;
      }

      localStorage.setItem('token', token);

      const userResponse = await getCurrentUser();
      const role = getRoleFromResponse(userResponse.data);

      localStorage.setItem('role', role);

      alert('Login Successful');
      navigate(roleRoutes[role] || '/customer');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Login Failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = getRegisterPayload();

      const response = await register(payload);

      if (response?.data?.message || response?.status === 200) {
        localStorage.setItem('role', 'CUSTOMER');
        alert('Registration Successful. Please login now.');
        setActiveTab('login');
        setRegisterForm({
          username: '',
          email: '',
          password: '',
        });
      } else {
        alert(response?.data?.message || 'Registration Failed');
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="brand-block">
          <h1>OROS_APP</h1>
          <p>
            OROS_APP is a modern online grocery ordering system that lets customers browse essentials,
            place orders, and track delivery while vendors manage products and sales, and admins oversee
            the full marketplace experience from one secure platform.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-toggle">
          <button
            type="button"
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => navigate('/?tab=login')}
          >
            Login
          </button>
          <button
            type="button"
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => navigate('/?tab=register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>

            <label>
              Username
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                placeholder="Enter your username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
              />
            </label>

            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>

            <label>
              Username
              <input
                type="text"
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                placeholder="Choose a username"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Choose a password"
                required
              />
            </label>

            <button type="submit" className="primary-btn success-btn">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Home;
