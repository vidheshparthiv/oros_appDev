import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getCurrentUser, getCurrentVendor, getVendorOrders, getVendorProducts, updateOrderStatus } from '../api/customerApi';

function VendorDashboard() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', stock: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        let firstVendor = null;
        try {
          const vendorResponse = await getCurrentVendor();
          firstVendor = vendorResponse.data;
        } catch (err) {
          // if vendor record doesn't exist, create one for this user
          if (err?.response?.status === 404) {
            const created = await (await import('../api/customerApi')).createMyVendor({});
            firstVendor = created.data;
          } else {
            throw err;
          }
        }
        setVendor(firstVendor);

        const productsResponse = await getVendorProducts(firstVendor.id);
        setProducts(productsResponse.data || []);

        const ordersResponse = await getVendorOrders(firstVendor.id);
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

    loadVendorData();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendor) return;

    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category || 'General',
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        navigate('/');
        return;
      }

      await addProduct(vendor.id, payload);
      setForm({ name: '', description: '', category: '', price: '', stock: '' });
      const productsResponse = await getVendorProducts(vendor.id);
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert('Session expired. Please log in again.');
        navigate('/');
        return;
      }
      alert(error?.response?.data?.message || 'Unable to add product');
    }
  };

  const handleStatusUpdate = async (orderId, nextStatus = 'CONFIRMED') => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      const refreshed = await getVendorOrders(vendor.id);
      setOrders((refreshed.data || []).filter((order) => order?.items?.length > 0));
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert('Session expired. Please log in again.');
        navigate('/');
        return;
      }
      alert(error?.response?.data?.message || 'Unable to update order status');
    }
  };

  if (loading) {
    return <div className="dashboard-page"><h2>Loading vendor dashboard...</h2></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Vendor Portal</p>
          <h1>{vendor?.user?.username || 'Vendor Dashboard'}</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" id="products">
          <h3>Products</h3>
          <ul className="simple-list">
            {products.length === 0 ? <li>No products yet.</li> : products.map((product) => (
              <li key={product.id}>{product.name} — ${Number(product.price || 0).toFixed(2)} ({product.stock} in stock)</li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card" id="orders">
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
                  {order.status === 'PENDING' && (
                    <button type="button" className="secondary-btn" onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}>
                      Mark Confirmed
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel form-panel" id="add-product">
        <h3>Add New Product</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Product name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <input name="description" value={form.description} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Electronics" required />
          </label>
          <label>
            Price
            <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Stock
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
          </label>
          <button type="submit" className="primary-btn">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default VendorDashboard;
