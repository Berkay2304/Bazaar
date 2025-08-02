import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bazaar'a Hoş Geldiniz
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              En kaliteli ürünleri en uygun fiyatlarla bulabileceğiniz online alışveriş platformu
            </p>
            <Link
              to="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600">
              Siparişlerinizi en kısa sürede kapınıza getiriyoruz
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Güvenli Ödeme</h3>
            <p className="text-gray-600">
              Güvenli ödeme sistemleri ile güvenle alışveriş yapın
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Müşteri Memnuniyeti</h3>
            <p className="text-gray-600">
              Müşteri memnuniyeti odaklı hizmet anlayışımız
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Hemen Alışverişe Başlayın
            </h2>
            <p className="text-gray-600 mb-8">
              Binlerce ürün arasından size en uygun olanı seçin
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ürünleri Görüntüle
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 