import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentVendor, getVendorProducts } from '../../api/customerApi';

function VendorProducts() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
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

        const productsResponse = await getVendorProducts(currentVendor.id);
        setProducts(productsResponse.data || []);
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

  if (loading) {
    return <div className="dashboard-page"><h2>Loading products...</h2></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Vendor Portal</p>
          <h1>{vendor?.user?.username || 'My Products'}</h1>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Products</h3>
        <ul className="simple-list">
          {products.length === 0 ? <li>No products yet.</li> : products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> — ${Number(product.price || 0).toFixed(2)}
              <div>{product.category || 'General'} • {product.stock} in stock</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VendorProducts;
