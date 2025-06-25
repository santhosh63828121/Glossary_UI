# 🧾 Glossary Management System (Frontend)

This is the **React-based frontend** for the Glossary Billing and Inventory Management System, connected to a Django backend via REST API. It offers a modern, responsive UI for managing products, billing, and sales history.

---

## 🚀 Features

- 📦 Add new items with photo, price, and quantity
- ➕ Increase stock quantity for existing items
- 💳 Generate and print bills
- 🧾 Track billing and sales history
- 🔒 Secure login using JWT token
- 📁 Upload and manage item photos
- 🎨 Responsive and mobile-friendly design
- 🔐 Protected dashboard routes using `PrivateRoute`

---

## 📁 Project Structure

```

Glossary\_UI/
├── public/
├── src/
│   ├── Components/
│   │   ├── Bill/             # Billing system
│   │   ├── DashBoard/        # Dashboard and Edit logic
│   │   ├── Uploads/          # Add & Increase Item UI
│   │   └── History/          # Sales History
│   ├── Pages/
│   │   ├── Login/            # Login Page
│   │   └── PrivateRoute/     # Route protection
│   ├── App.jsx               # Main app routes and layout
│   ├── index.css
│   └── main.jsx              # React entry point
├── .gitignore
├── vite.config.js
├── package.json
└── README.md

````

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/glossary-frontend.git
cd Glossary_UI
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npm run dev
```

The app will run at: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication

* Users must log in with their Django credentials.
* JWT token is stored in `localStorage`.
* Protected routes are handled using `<PrivateRoute />` component.

```js
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login';
}
```

---

## 🔌 API Integration

| Feature           | API Endpoint                    |
| ----------------- | ------------------------------- |
| Login             | `POST /api/login/`              |
| Add Item          | `POST /api/item/add/`           |
| List Items        | `GET /api/items/`               |
| Increase Quantity | `POST /api/items/:id/increase/` |
| Delete Item       | `DELETE /api/items/:id/delete/` |
| Add Sale          | `POST /api/sales/`              |
| Sales History     | `GET /api/sales/history/`       |

Ensure backend is running on: `http://localhost:8000`

---

## 🔒 Protected Routes

Example: `App.jsx`

```jsx
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

---

## ✨ Sample Screenshots

📸 *You can add actual screenshots here to show how your app looks.*

---

## 📦 Dependencies

* React
* Axios
* React Router DOM
* Vite
* Tailwind CSS / Custom CSS (optional)
* JWT Authentication

---

## 🔄 Deployment

To build for production:

```bash
npm run build
```

To preview production build locally:

```bash
npm run preview
```

---

## 📄 License

MIT License – use freely for personal or commercial purposes.

---

## 🙌 Author

Made with ❤️ by ** Santhsohs D **

---
Runnding Commands
---
## ✅ **Frontend Dependencies**

In your project (`Glossary_UI`), make sure you have the following packages:

### 📦 Core Dependencies

```bash
npm install react react-dom
```

### 📦 Development Tools (Vite)

```bash
npm install --save-dev vite
```

### 📦 Routing

```bash
npm install react-router-dom
```

### 📦 HTTP Client

```bash
npm install axios
```

### 📦 Optional Styling Tools

If you're using Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

If you're using plain CSS, you don’t need the above.

---

## ⚙️ **Run Frontend Commands**

### 1. ✅ Install All Dependencies

```bash
npm install
```

This will install all packages defined in `package.json`.

---

### 2. ▶️ Start Development Server

```bash
npm run dev
```

### 3. 🏗️ Build for Production

```bash
npm run build
```





