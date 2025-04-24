
This README provides clear instructions for:
1. Setting up the development environment
2. Generating necessary SSL certificates
3. Installing dependencies
4. Configuring environment variables
5. Running the application
6. Understanding security features

You can further customize it by adding:
- Specific version requirements
- Troubleshooting guide
- API documentation
- Contributing guidelines

# Tower Data Web Application

A secure web application for managing tower data with mutual TLS authentication.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- OpenSSL
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Rohan120805/fisherWatch.git
```

2. Create certificate directories:
```bash
mkdir certs
```
```bash
mkdir certs\ca
```
```bash
mkdir certs\server
```
```bash
mkdir certs\client
```

3. Generate SSL certificates using OpenSSL:

# 1. Generate CA private key and certificate
```bash
openssl genrsa -out certs/ca/ca.key 4096
```
```bash
openssl req -x509 -new -nodes -key certs/ca/ca.key -sha256 -days 3650 -out certs/ca/ca.crt -subj "/CN=FisherWatch"
```
# 2. Generate server private key and CSR
```bash
openssl genrsa -out certs/server/server.key 4096
```
```bash
openssl req -new -key certs/server/server.key -out certs/server/server.csr -subj "/CN=localhost"
```
# 3. Generate server certificate signed by CA
```bash
openssl x509 -req -in certs/server/server.csr -CA certs/ca/ca.crt -CAkey certs/ca/ca.key -CAcreateserial -out certs/server/server.crt -days 365 -sha256
```
# 4. Generate client private key and CSR
```bash
openssl genrsa -out certs/client/client.key 4096
```
```bash
openssl req -new -key certs/client/client.key -out certs/client/client.csr -subj "/CN=client"
```
# 5. Generate client certificate signed by CA
```bash
openssl x509 -req -in certs/client/client.csr -CA certs/ca/ca.crt -CAkey certs/ca/ca.key -CAcreateserial -out certs/client/client.crt -days 365 -sha256
```

4. Install backend dependencies:

```bash
cd backend
```
```bash
npm install
```

5. Install frontend dependencies:

```bash
cd ../frontend
```
```bash
npm install
```

6. Configure environment variables:
# Create .env file in the root directory:

```
MONGO_LOCAL_URI=mongodb://0.0.0.0:27017/towers
PORT=5000
SERVER=https://localhost:5000
CLIENT=http://localhost:5173
SSL_CA_PATH=../certs/ca/ca.crt
SSL_CERT_PATH=../certs/server/server.crt
SSL_KEY_PATH=../certs/server/server.key
```

# Create .env file in the frontend directory:

```
VITE_API_URL=https://localhost:5000
VITE_CLIENT_CERT_PATH=../certs/client/client.crt
VITE_CLIENT_KEY_PATH=../certs/client/client.key
VITE_CA_CERT_PATH=../certs/ca/ca.crt
SERVER_KEY_PATH=../certs/server/server.key
SERVER_CERT_PATH=../certs/server/server.crt
VITE_PORT=5173
```

## Testing with Postman

### Configure Mutual TLS Authentication in Postman

1. Open Postman and create a new request
2. Go to Settings (Gear Icon) > Certificates
3. Add Client Certificate:
   - Host: localhost:5000
   - CRT file: /certs/client/client.crt
   - KEY file: /certs/client/client.key
   - CA file: /certs/ca/ca.crt

### Send Data to API Endpoints

1. **Add Tower Data**
```bash
POST https://localhost:5000/api/towers
```
```bash
Content-Type: application/json
```

### Browser Configuration

#### Creating Combined Certificate for Browser

1. Create PKCS#12 (.p12) file combining client certificate and private key:
```bash
openssl pkcs12 -export -out certs/client/client.p12 -inkey certs/client/client.key -in certs/client/client.crt -certfile certs/ca/ca.crt
```

#### Importing Certificates in Chrome

1. Import Client Certificate:
   - Open Chrome Settings (⋮ menu > Settings)
   - Navigate to Privacy and security > Security > Manage certificates
   - Go to "Your Certificates" tab
   - Click "Import"
   - Select `certs/client/client.p12`
   - Enter the password you set when creating the .p12 file

2. Import CA Certificate (if needed):
   - In Chrome Settings > Security > Manage certificates
   - Go to "Trusted Root Certification Authorities" tab
   - Click "Import"
   - Select `certs/ca/ca.crt`

3. Restart Chrome

After configuration, when visiting `https://localhost:5000`:
   - Chrome will recognize your client certificate
   - Present it automatically to the server
   - Allow secure access to the application

7. Running the Application:
# Note: Run these commands in the root directory of the project.

# To run the Application in Development mode:
```bash
npm run dev
```

# To deploy the Application:
```bash
npm run deploy
```

### User Management

#### Creating a New User
1. **Register User**
```bash
POST https://localhost:5000/api/users/register
```
```bash
Content-Type: application/json

{
    "userId": "your_user_id",
    "password": "your_password"
}
```

If you want to disable "Register New User Feature", go to backend\controllers\user.controller.js and remove 'register' function and remove
```bash
router.post('/register', register);
```
line from backend\routes\user.routes.js.