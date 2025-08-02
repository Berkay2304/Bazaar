# Bazaar Backend API

Bu backend API, Bazaar e-ticaret uygulaması için geliştirilmiştir.

## Environment Variables

Aşağıdaki environment variables'ları `.env` dosyasında tanımlamanız gerekiyor:

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bazaar?retryWrites=true&w=majority

# JWT Secret Key (güçlü bir secret key kullanın)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (Vercel deployment URL)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Server Port (Render otomatik olarak ayarlar)
PORT=5000
```

## Deployment (Render)

1. Render'da yeni bir Web Service oluşturun
2. GitHub repository'nizi bağlayın
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables'ları ekleyin:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Güçlü bir JWT secret key
   - `FRONTEND_URL`: Frontend Vercel URL'iniz

## API Endpoints

### Health Check
- `GET /health` - Server durumunu kontrol eder

### Users
- `POST /api/users/register` - Kullanıcı kaydı
- `POST /api/users/login` - Kullanıcı girişi
- `GET /api/users/me` - Kullanıcı bilgileri (auth gerekli)

### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Tek ürün detayı
- `POST /api/products` - Yeni ürün ekle (admin gerekli)
- `PUT /api/products/:id` - Ürün güncelle (admin gerekli)
- `DELETE /api/products/:id` - Ürün sil (admin gerekli)

### Cart
- `GET /api/cart` - Sepet içeriği (auth gerekli)
- `POST /api/cart` - Sepete ürün ekle (auth gerekli)
- `DELETE /api/cart/:productId` - Sepetten ürün sil (auth gerekli)

### Orders
- `GET /api/orders` - Siparişleri listele (auth gerekli)
- `POST /api/orders` - Yeni sipariş oluştur (auth gerekli)

## Troubleshooting

### CORS Hatası
- Frontend URL'inin doğru olduğundan emin olun
- Environment variable'da `FRONTEND_URL` tanımlı olmalı

### MongoDB Bağlantı Hatası
- `MONGO_URI` environment variable'ının doğru olduğundan emin olun
- MongoDB Atlas'ta IP whitelist ayarlarını kontrol edin

### JWT Hatası
- `JWT_SECRET` environment variable'ının tanımlı olduğundan emin olun
- Güçlü bir secret key kullanın

## Test

API'yi test etmek için frontend'de `/test` sayfasını kullanabilirsiniz. 