import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError('Sepet yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }

    setUpdating(true);
    try {
      await api.put('/cart', {
        productId,
        quantity: newQuantity
      });
      await fetchCart();
    } catch (err) {
      alert('Miktar güncellenirken bir hata oluştu');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      alert('Ürün sepetten çıkarılırken bir hata oluştu');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
        
        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">Sepetiniz boş</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Alışverişe Başla
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Sepet Ürünleri</h2>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.product._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.product.description}
                          </p>
                          <p className="text-blue-600 font-semibold">
                            ₺{item.product.price}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={updating}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updating}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₺{item.product.price * item.quantity}
                          </p>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            disabled={updating}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sepet Özeti */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Sepet Özeti</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-semibold">₺{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo:</span>
                    <span className="font-semibold text-green-600">Ücretsiz</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam:</span>
                    <span className="text-blue-600">₺{calculateTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Siparişi Tamamla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 