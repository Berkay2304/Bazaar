import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Bazaar
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/products" className="hover:text-blue-200 transition-colors">
              Ürünler
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="hover:text-blue-200 transition-colors">
                  Sepet
                </Link>
                <Link to="/orders" className="hover:text-blue-200 transition-colors">
                  Siparişlerim
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition-colors">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 