import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentVendor, getVendorOrders, updateOrderStatus } from '../../api/customerApi';

function VendorOrders() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const vendorResponse = await getCurrentVendor();
        const currentVendor = vendorResponse.data;
        setVendor(currentVendor);

        const ordersResponse = await getVendorOrders(currentVendor.id);
        setOrders((ordersResponse.data || []).filter((order) => order?.items?.length > 0));
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      const refreshed = await getVendorOrders(vendor.id);
      setOrders((refreshed.data || []).filter((order) => order?.items?.length > 0));
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
        return;
      }
      alert(error?.response?.data?.message || 'Unable to update order status');
    }
  };

  if (loading) {
    return <div className="dashboard-page"><h2>Loading orders...</h2></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Vendor Portal</p>
          <h1>{vendor?.user?.username || 'Orders'}</h1>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Orders</h3>
        <ul className="simple-list">
          {orders.length === 0 ? <li>No orders yet.</li> : orders.map((order) => (
            <li key={order.id}>
              <div>Order #{order.id} — {order.status} — ${Number(order.totalPrice || 0).toFixed(2)}</div>
              <div className="status-row">
                <select
                  value={order.status || 'PENDING'}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  aria-label={`Update status for order ${order.id}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VendorOrders;
