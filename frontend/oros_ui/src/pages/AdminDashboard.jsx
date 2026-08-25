import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, getAllUsers } from '../api/customerApi';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
        ]);

        setUsers(usersResponse.data || []);
        setOrders(ordersResponse.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadAdminData();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Admin Portal</p>
          <h1>Admin Dashboard</h1>
        </div>
        <button type="button" className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Users</h3>
          <ul className="simple-list">
            {users.length === 0 ? <li>No users yet.</li> : users.map((user) => (
              <li key={user.id}>{user.username} — {user.role}</li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Orders</h3>
          <ul className="simple-list">
            {orders.length === 0 ? <li>No orders yet.</li> : orders.map((order) => (
              <li key={order.id}>Order #{order.id} — {order.status} — ${Number(order.totalPrice || 0).toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>

      
    </div>
  );
}

export default AdminDashboard;
