
# E-Commerce Backend API

A robust e-commerce backend API built with NestJS, featuring user authentication, product management, media handling, and secure data encryption/decryption capabilities.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user lifecycle with OTP verification and password reset
- **Product Management**: Categories, sub-categories, and product CRUD operations
- **Media Handling**: File upload and management with Multer
- **Data Encryption**: Optional request/response encryption for enhanced security
- **Database**: PostgreSQL with Sequelize ORM and migrations
- **Logging**: Comprehensive request/response logging with Winston
- **Docker Support**: Containerized deployment with Docker Compose

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm package manager

## Project Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd e-commerce-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create environment files in `src/config/env/` directory:

- `development.env` - for development environment
- `staging.env` - for staging environment  
- `production.env` - for production environment

**Important**: Environment files are encrypted using `secure-env`. Use the following command to encrypt your environment files:

```bash
npx secure-env src/config/env/development.env -s <Key> 
```


## Environment Variables

### Required Environment Variables

Create your environment file with the following variables:

### Sample .env File
```env
# Application
NODE_ENV=development
PORT=3000

# Database Configuration
POSTGRES_DB_NAME=e-commerce
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PASSWORD=your_db_password
POSTGRES_DB_PORT=5432
POSTGRES_DB_USERNAME=your_db_username

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
JWT_ALGORITHM=HS256

# API Security
SERVER_API_KEY=your_server_api_key_here //ANY RANDOM KEY

# Encryption/Decryption (Optional)
ENCRYPTION_DECRYPTION_ALGORITHM=AES256
ENCRYPTION_DECRYPTION_KEY=your_32_byte_hex_key_here
ENCRYPT=false

```

## Running the Application

### Development Mode
```bash
# Start in development mode with file watching
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Using Docker (Recommanded)
```bash
# Start all services (database + application)
docker-compose up -d
```

## API Usage Overview

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints
```http
POST /auth/login             # User login
```

### User Management
```http
POST   /users         # User registration
GET    /users               # Get all users (admin)
GET    /users/:id           # Get user by ID
PUT    /users/:id           # Update user
DELETE /users/:id           # Delete user
GET    /users/profile       # Get current user profile
```

### Category Management
```http
GET    /categories          # Get all categories
POST   /categories          # Create category
GET    /categories/:id      # Get category by ID
PUT    /categories/:id      # Update category
POST   /categories/delete        # Delete category
```

### Sub-Category Management
```http
GET    /sub-categories      # Get all sub-categories
POST   /sub-categories      # Create sub-category
GET    /sub-categories/:id  # Get sub-category by ID
PUT    /sub-categories/:id  # Update sub-category
POST  /sub-categories/delete  # Delete sub-category
```

### Media Management
```http
DELETE /media/:id           # Delete media
```


## Encryption/Decryption System

This application includes an optional encryption/decryption system for enhanced security of API requests and responses.

### How It Works

The encryption system uses AES-256 symmetric encryption and is controlled by the `ENCRYPT` environment variable.

#### When Encryption is Enabled (`ENCRYPT=true`)

**Request Encryption:**
- Client sends encrypted data in the `data` field
- Server automatically decrypts the request body
- Multipart form data (file uploads) are not encrypted

**Response Encryption:**
- Server encrypts all response data before sending
- Client must decrypt the response to access the actual data

**Request Format:**
```json
{
  "data": "encrypted_request_payload_here"
}
```


#### When Encryption is Disabled (`ENCRYPT=false`)

- Standard JSON request/response format
- No encryption/decryption processing
- Direct data transmission

### Configuration

Set these environment variables for encryption:

```env
ENCRYPTION_DECRYPTION_ALGORITHM=AES256
ENCRYPTION_DECRYPTION_KEY=your_32_byte_hex_key_here
ENCRYPT=true  # or false to disable
```

### Key Generation

Generate a secure 32-byte hex key for encryption:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### Implementation Details

- **Algorithm**: AES-256-CBC
- **Key Length**: 32 bytes (256 bits)
- **Automatic IV Generation**: Each encryption uses a unique initialization vector
- **Error Handling**: Invalid encrypted data returns a bad request error
- **File Upload Exception**: Multipart form data bypasses encryption

```

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── guards/             # JWT guards
│   ├── strategies/         # Passport strategies
│   └── *.ts               # Auth controller, service, module
├── common/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── dtoes/             # Data transfer objects
│   ├── filters/           # Exception filters
│   ├── helper/            # Helper services
│   ├── interceptors/      # Request/response interceptors
│   ├── middlewares/       # Custom middlewares
│   └── utils/             # Utility functions and constants
├── config/                # Configuration files
│   ├── env/              # Environment files (encrypted)
│   └── configuration.ts   # App configuration
├── migrations/            # Database migrations and seeders
│   ├── config/           # Migration configuration
│   ├── models/           # Migration models
│   └── seeders/          # Database seeders
├── modules/               # Feature modules
│   ├── category/         # Category management
│   ├── mail/             # Email service
│   ├── media/            # File upload/management
│   ├── sub-category/     # Sub-category management
│   └── user/             # User management
├── public/               # Static files
├── shared/               # Shared modules
│   ├── database/         # Database configuration
│   └── tables/           # Entity definitions
└── main.ts               # Application entry point
```

## Available Scripts

```bash
# Development
npm run start              # Start application
npm run start:dev          # Start with file watching
npm run start:debug        # Start in debug mode

```

## Docker Deployment (Use this command to run app)

```bash
# Start all services
docker-compose up -d

# Run database seeders (after containers are running)
docker exec -it <container_name> /bin/sh
cd dist/migrations
NODE_ENV=development npx sequelize-cli db:seed:all
```

## Database Management

### Migrations

```bash
# Create new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed seeder-file-name
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Request Validation**: Class-validator for input validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Rate Limiting**: Built-in request rate limiting
- **Data Encryption**: Optional AES-256 encryption for sensitive data

## Logging

The application uses Winston for comprehensive logging:

- **Request/Response Logging**: All API calls are logged
- **Error Logging**: Detailed error tracking
- **Multiple Transports**: Console and file logging
- **Timezone Support**: UTC, India, and USA timestamps


## License

This project is licensed under the UNLICENSED License.

