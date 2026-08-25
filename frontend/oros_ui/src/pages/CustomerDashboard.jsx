import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllProducts,
  getCurrentUser,
  getCustomerOrders,
  createOrder,
  addOrderItem,
  placeOrder as apiPlaceOrder,
  searchProducts,
} from '../api/customerApi';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [productQty, setProductQty] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      ),
    [cart],
  );

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      let productsResult;
      if (searchTerm && searchTerm.length > 0) {
        productsResult = await searchProducts(searchTerm);
      } else {
        productsResult = await getAllProducts(page, pageSize);
      }
      setProducts(productsResult.data || []);

      let userData = null;
      try {
        const userRes = await getCurrentUser();
        userData = userRes.data;
        setProfile(userData);

        if (userData?.id) {
          const ordersRes = await getCustomerOrders(userData.id);
          setOrders(ordersRes.data || []);
        }
      } catch (profileError) {
        console.warn('Profile fetch failed:', profileError);
        setProfile(null);
        setOrders([]);
      }

      setLoadError('');
    } catch (error) {
      console.error(error);
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
        return;
      }

      setLoadError('Unable to load customer dashboard right now.');
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      loadData();
    }, 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const updateProductQty = (productId, delta) => {
    setProductQty((current) => ({
      ...current,
      [productId]: Math.max(1, (current[productId] || 1) + delta),
    }));
  };

  const addToCart = (product) => {
    const qty = productQty[product.id] || 1;

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
        },
      ];
    });

    setProductQty((current) => ({ ...current, [product.id]: 1 }));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const placeOrder = async () => {
    if (!profile || cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const payload = {
        customer: { id: profile.id },
        totalPrice: total,
        status: 'PENDING',
      };

      const orderResponse = await createOrder(payload);
      const createdOrder = orderResponse.data;

      const itemPromises = cart.map((item) =>
        addOrderItem({
          orderId: createdOrder.id,
          productId: item.id,
          quantity: item.quantity,
        }),
      );

      await Promise.all(itemPromises);
      setCart([]);
      await loadData();
      alert('Order placed successfully. Status is now pending.');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Unable to place order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return <div className="dashboard-page"><h2>Loading customer dashboard...</h2></div>;
  }

  return (
    <div className="dashboard-page customer-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Customer Portal</p>
          <h1>Welcome, {profile?.username || 'Customer'}</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loadError && <div className="panel error-banner">{loadError}</div>}

      <div className="customer-layout">
        <section className="panel">
          <div className="panel-header">
            <h2>Products</h2>
            <div className="search-row">
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="pager-row">
              <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}>
                Prev
              </button>
              <span>Page {page + 1}</span>
              <button type="button" onClick={() => setPage((current) => current + 1)}>
                Next
              </button>
            </div>
          </div>

          <div className="product-list">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>

                <div className="product-meta">
                  <span>Price: ${Number(product.price || 0).toFixed(2)}</span>
                  <span>Stock: {product.stock}</span>
                </div>

                <div className="quantity-row">
                  <button type="button" onClick={() => updateProductQty(product.id, -1)}>-</button>
                  <span>{productQty[product.id] || 1}</span>
                  <button type="button" onClick={() => updateProductQty(product.id, 1)}>+</button>
                </div>

                <button type="button" className="primary-btn" onClick={() => addToCart(product)}>
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="panel-header">
            <h2>Cart</h2>
          </div>

          {cart.length === 0 ? (
            <p className="empty-text">No items in cart yet.</p>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>${Number(item.price).toFixed(2)} each</span>
                  </div>

                  <div className="cart-controls">
                    <button type="button" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total">
            <span>Total</span>
            <strong>${Number(total).toFixed(2)}</strong>
          </div>

          <button type="button" className="primary-btn success-btn" onClick={placeOrder}>
            Place Order
          </button>
        </aside>
      </div>

      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Previous Orders</h2>
          </div>

          {orders.length === 0 ? (
            <p className="empty-text">No previous orders yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-topline">
                    <strong>Order #{order.id}</strong>
                    <span className="status-badge">{order.status}</span>
                  </div>
                  <p>Total: ${Number(order.totalPrice || 0).toFixed(2)}</p>
                  <small>{new Date(order.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}

export default CustomerDashboard;
