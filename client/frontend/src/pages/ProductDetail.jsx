import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Ürün yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await api.post('/cart', {
        productId: product._id,
        quantity: parseInt(quantity)
      });
      alert('Ürün sepete eklendi!');
    } catch (err) {
      alert('Ürün sepete eklenirken bir hata oluştu');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Ürün bulunamadı'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ürünlere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Ürün Resmi */}
            <div className="md:w-1/2">
              <div className="h-96 md:h-full bg-gray-200 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Ürün Bilgileri */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="text-2xl font-bold text-blue-600 mb-6">
                ₺{product.price}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Açıklama
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.category && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kategori
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>
              )}

              {product.stock !== undefined && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Stok Durumu
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} adet mevcut` : 'Stokta yok'}
                  </span>
                </div>
              )}

              {product.stock > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Miktar
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={!user || product.stock <= 0 || addingToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Ekleniyor...' : 'Sepete Ekle'}
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Geri Dön
                </button>
              </div>

              {!user && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Sepete ürün eklemek için lütfen giriş yapın.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 