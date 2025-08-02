import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminOrders = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      // Bu örnekte tüm siparişleri alıyoruz
      // Gerçek uygulamada admin için özel endpoint olabilir
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
            <p className="text-gray-600 mt-2">Tüm siparişleri görüntüle ve yönet</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Geri Dön
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Henüz sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sipariş #{order._id.slice(-8)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Müşteri: {order.user?.name || 'Bilinmeyen Kullanıcı'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ₺{order.totalAmount}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'pending')}`}>
                        {order.status || 'Beklemede'}
                      </span>
                    </div>
                  </div>

                  {/* Sipariş Ürünleri */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Miktar: {item.quantity} x ₺{item.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₺{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Teslimat Bilgileri */}
                  {order.shippingAddress && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Teslimat Adresi</h4>
                      <div className="text-gray-600 text-sm">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                        {order.shippingAddress.phone && (
                          <p>Tel: {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sipariş Durumu Güncelleme */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sipariş Durumu</h4>
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                        onClick={() => console.log('Beklemede durumuna güncelle')}
                      >
                        Beklemede
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                        onClick={() => console.log('İşleniyor durumuna güncelle')}
                      >
                        İşleniyor
                      </button>
                      <button
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                        onClick={() => console.log('Kargoda durumuna güncelle')}
                      >
                        Kargoda
                      </button>
                      <button
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                        onClick={() => console.log('Teslim edildi durumuna güncelle')}
                      >
                        Teslim Edildi
                      </button>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                        onClick={() => console.log('İptal edildi durumuna güncelle')}
                      >
                        İptal Edildi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 