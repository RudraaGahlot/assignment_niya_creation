# Niya Celebration 


## 🌟 Features

- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Product Catalog**: Browse products by categories with advanced filtering
- **Shopping Cart**: Add, update, and manage items with session-based storage
- **Search & Filter**: Advanced product filtering by price, category, and attributes
- **Modern UI**: Clean, professional interface with smooth interactions
- **Database Integration**: Full CRUD operations with MySQL backend

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **mysql2** - MySQL client for Node.js

## 📁 Project Structure

```
rony-project-1/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static assets and images
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── database/           # Database schema and migrations
│   ├── server.js          # Main server file
│   └── package.json
├── images/                 # Product and banner images
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RudraaGahlot/assignment_niya_creation
   cd assignment_niya_creation
   ```

2. **Set up the database**
   - Create a MySQL database named `niya_celebration`
   - Run the SQL script from `backend/database/init.sql`
   ```sql
   mysql -u root -p < backend/database/init.sql
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   - Create `.env` file in the backend directory
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=niya_celebration
   PORT=5001
   ```

5. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # or
   node server.js
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📱 Pages & Features

### Homepage
- Hero section with call-to-action
- Featured product showcase
- Category browsing
- Newsletter subscription

### Product Listing
- Grid/list view toggle
- Advanced filtering (price, category, size)
- Sort functionality
- Responsive pagination

### Product Details
- Image gallery with thumbnails
- Product specifications
- Size selection
- Add to cart functionality
- Related products

### Shopping Cart
- Session-based cart storage
- Quantity management
- Real-time price calculations
- Cart persistence

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/categories/:slug/products` - Get products by category

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove cart item
- `DELETE /api/cart/:sessionId` - Clear cart

