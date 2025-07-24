# 🔗 MERN URL Shortener Microservice

A modern, fully functional URL shortener microservice using the **MERN stack** (MongoDB, Express.js, React, Node.js).
It supports custom shortcodes, validity-based expiry, referrer tracking

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/mern-url-shortener.git
cd mern-url-shortener
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Add to .env
please connect your database  connection string here

MONGO_URI=mongodb://localhost:27017/urlshortener
PORT=5000

# Start server
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Optional proxy (add to package.json)
"proxy": "http://localhost:5000"

# Start frontend
npm start
```

---
