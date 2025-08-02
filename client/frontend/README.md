# Bazaar Frontend

Bu frontend uygulaması, Bazaar e-ticaret platformu için geliştirilmiştir.

## API Bağlantısı

Frontend, backend API'sine bağlanmak için `src/services/api.js` dosyasında tanımlı URL'yi kullanır:

```javascript
const API_BASE_URL = 'https://bazaar-dcum.onrender.com';
```

## Deployment (Vercel)

1. Vercel'de yeni bir proje oluşturun
2. GitHub repository'nizi bağlayın
3. Root Directory: `client/frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`

## Environment Variables

Vercel'de aşağıdaki environment variables'ları tanımlayabilirsiniz:

```env
VITE_API_URL=https://bazaar-dcum.onrender.com
```

## Test Sayfası

API bağlantısını test etmek için `/test` sayfasını kullanabilirsiniz. Bu sayfa:

- Health check endpoint'ini test eder
- Products API'sini test eder
- Login endpoint'ini test eder

## Troubleshooting

### API Bağlantı Hatası
- Backend server'ın çalıştığından emin olun
- CORS ayarlarının doğru olduğunu kontrol edin
- Network sekmesinde hataları kontrol edin

### Build Hatası
- Node.js versiyonunun uyumlu olduğundan emin olun
- Dependencies'lerin doğru yüklendiğini kontrol edin

### Runtime Hatası
- Browser console'da hataları kontrol edin
- API response'larını network sekmesinde inceleyin

## Development

```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev

# Build
npm run build
```

## API Endpoints Kullanımı

Frontend'de API çağrıları için `api` instance'ı kullanılır:

```javascript
import api from '../services/api';

// GET request
const products = await api.get('/products');

// POST request
const loginResponse = await api.post('/users/login', { email, password });

// Auth header otomatik olarak eklenir
const userData = await api.get('/users/me');
```
