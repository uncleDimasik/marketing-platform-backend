# Backend Server

This backend server provides JWT-based authentication using HTTP-only cookies for security. It is built using Node.js,
Express, and MongoDB.

## Features

- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **HTTP-Only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks.
- **Advertising Campaign**: Prediction: API to predict the performance of advertising campaigns based on input
  parameters.
- **CORS**: Configured to allow requests from a specified frontend origin.
- **Helmet**: Security middleware to set various HTTP headers.
- **Swagger Documentation**: API documentation using Swagger.

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory and add the following environment variables:
   ```bash
    NODE_ENV='development'
    COOKIE_DOMAIN=localhost
    PORT=5000
    DB_URL=mongodb+srv://username:password@cluster0.jmy92.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_ACCESS_SECRET=jwt-secret-key
    JWT_REFRESH_SECRET=jwt-refresh-secret-key
    CLIENT_URL=http://localhost:5173
    COOKIE_SECRET=a_very_secret_secret
    COOKIE_SAME_SITE=lax
    COOKIE_PATH=/
   ```

### Running the Server

- **Development**:
  ```bash
  npm run dev
  ```

- **Production**:
  ```bash
  npm start
  ```

### API Documentation

- **Swagger**: The API documentation is available at `/api-docs`.

### Linting and Formatting

- **Check Formatting**:
  ```bash
  npm run format:check
  ```

- **Format Code**:
  ```bash
  npm run format:write
  ```

- **Check Linting**:
  ```bash
  npm run lint:check
  ```

- **Fix Linting**:
  ```bash
  npm run lint:fix
  ```

## Deploying

This project is set up to be deployed on [Render](https://render.com/)
