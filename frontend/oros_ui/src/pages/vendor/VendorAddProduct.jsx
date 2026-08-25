import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getCurrentVendor } from '../../api/customerApi';

function VendorAddProduct() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', stock: '' });
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
        setVendor(vendorResponse.data);
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

      await addProduct(vendor.id, payload);
      setForm({ name: '', description: '', category: '', price: '', stock: '' });
      alert('Product added successfully');
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

  if (loading) {
    return <div className="dashboard-page"><h2>Loading form...</h2></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Vendor Portal</p>
          <h1>{vendor?.user?.username || 'Add Product'}</h1>
        </div>
      </div>

      <div className="panel form-panel">
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

export default VendorAddProduct;
