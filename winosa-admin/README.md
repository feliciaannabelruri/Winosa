# Winosa Admin Frontend

Admin dashboard for **PT. Winosa Mitra Bharatadjaya** — built with React, TypeScript, Vite, and Tailwind CSS.

---

## Project Structure

```
winosa-admin/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── ProtectedRoute.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── BlogFormModal.tsx
│   │   └── PortfolioFormModal.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BlogsPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ServicesPage.tsx
│   │   └── ContactsPage.tsx
│   ├── services/            # API calls
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts
│   │   ├── blogService.ts
│   │   ├── portfolioService.ts
│   │   ├── serviceService.ts
│   │   └── analyticsService.ts
│   └── types/
│       └── index.ts         # TypeScript interfaces
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Step-by-Step Setup

### Step 1 — Prerequisites

Make sure you have:
- Node.js 18+ installed
- Backend server running (see backend-project)

### Step 2 — Install Frontend Dependencies

```bash
cd winosa-admin
npm install
```

### Step 3 — Configure Environment

Create a `.env` file in the `winosa-admin` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

> If your backend runs on a different port, update this accordingly.

### Step 4 — Setup & Start Backend First

```bash
# In backend-project folder
cd backend-project
npm install

# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/winosa
# JWT_SECRET=your_super_secret_key_here
# PORT=5000
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your@email.com
# EMAIL_PASSWORD=your_email_password
# EMAIL_FROM=Winosa <your@email.com>
# IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
# IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
# IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Start backend
npm run dev
```

### Step 5 — Create Admin Account

Call the register endpoint to create your first admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@winosa.com", "password": "password123"}'
```

Or use Postman / Thunder Client with:
- **POST** `http://localhost:5000/api/auth/register`
- Body: `{ "name": "Admin", "email": "admin@winosa.com", "password": "password123" }`

### Step 6 — Seed Sample Data (Optional)

```bash
# In backend-project folder
npm run seed
```

### Step 7 — Start Frontend

```bash
# In winosa-admin folder
npm run dev
```

Open **http://localhost:3000** in your browser.

### Step 8 — Login

Use the credentials you created in Step 5:
- Email: `admin@winosa.com`
- Password: `password123`

---

## ✨ Features

| Page | Features |
|------|----------|
| **Login** | JWT auth, session persistence |
| **Dashboard** | Analytics overview, recent/popular blogs |
| **Blogs** | List, search, filter, add/edit/delete with image upload |
| **Portfolio** | Card grid, filter, add/edit/delete with image upload |
| **Services** | Card grid, add/edit/delete |
| **Contacts** | View messages from visitors |

---

## 🔌 API Connection

The frontend connects to the backend via:

| Feature | Endpoint |
|---------|----------|
| Login | `POST /api/auth/login` |
| Dashboard stats | `GET /api/admin/analytics` |
| Blogs | `GET/POST/PUT/DELETE /api/admin/blog` |
| Portfolio | `GET/POST/PUT/DELETE /api/admin/portfolio` |
| Services | `GET/POST/PUT/DELETE /api/admin/services` |
| Contacts | `GET /api/contact` |

Auth token is automatically attached to all admin requests via Axios interceptor.

---

## 🛠️ Build for Production

```bash
npm run build
```

Output in the `dist/` folder. Deploy to any static host (Vercel, Netlify, etc.).

---

## 🐛 Troubleshooting

**CORS error?** Add the frontend URL to your backend CORS config:
```js
app.use(cors({ origin: 'http://localhost:3000' }));
```

**401 Unauthorized?** Token may have expired — just log out and log back in.

**Analytics endpoint not found?** Make sure this route is in `server.js`:
```js
app.use('/api/admin/analytics', require('./routes/admin/analyticsRoutes'));
```
