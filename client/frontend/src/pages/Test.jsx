import { useState } from 'react';
import api from '../services/api';

const Test = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results = [];

    // Test 1: Health check
    try {
      const healthResponse = await api.get('/health');
      results.push({
        test: 'Health Check',
        status: 'PASS',
        message: `Server is running: ${healthResponse.data.message}`,
        data: healthResponse.data
      });
    } catch (error) {
      results.push({
        test: 'Health Check',
        status: 'FAIL',
        message: `Server not reachable: ${error.message}`,
        error: error.response?.data || error.message
      });
    }

    // Test 2: Products endpoint
    try {
      const productsResponse = await api.get('/products');
      results.push({
        test: 'Products API',
        status: 'PASS',
        message: `Found ${productsResponse.data.length} products`,
        data: productsResponse.data
      });
    } catch (error) {
      results.push({
        test: 'Products API',
        status: 'FAIL',
        message: `Products API error: ${error.message}`,
        error: error.response?.data || error.message
      });
    }

    // Test 3: Login endpoint (without credentials)
    try {
      await api.post('/users/login', { email: 'test@test.com', password: 'test' });
      results.push({
        test: 'Login API',
        status: 'PASS',
        message: 'Login endpoint is accessible'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        results.push({
          test: 'Login API',
          status: 'PASS',
          message: 'Login endpoint is accessible (expected error for invalid credentials)',
          error: error.response.data
        });
      } else {
        results.push({
          test: 'Login API',
          status: 'FAIL',
          message: `Login API error: ${error.message}`,
          error: error.response?.data || error.message
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Sayfası</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testler çalışıyor...' : 'Testleri Çalıştır'}
        </button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Sonuçları:</h2>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'PASS' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      result.status === 'PASS' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                <p className="mt-2 text-sm">{result.message}</p>
                {result.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600">Hata Detayları</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </details>
                )}
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600">Response Data</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test; 