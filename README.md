# Auto-Responders - ESP Integration API (Mailchimp & GetResponse)

---
This is a **Node.js + Express + MongoDB** backend service that allows users to connect their **Mailchimp** or **GetResponse** accounts by saving their API keys and fetching available audiences/lists.

---

##  Features

* Store and validate **Mailchimp** or **GetResponse** API keys
* Verify connection to each platform
* Fetch all **lists (audiences/campaigns)** from connected accounts
* Efficient **error handling** with consistent JSON responses
* MongoDB persistence of integration records

---

##  Tech Stack

* **Node.js** / **Express**
* **TypeScript**
* **MongoDB** with **Mongoose**
* **Axios** for external API requests
* **dotenv** for environment variables

---

##  Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/chinasa056/Auto-Responders.git
cd Auto-Responders
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with example variables matching those found in (.env.example)

```env
PORT=
MONGODB_URI=
```

### 4. Run Project

```bash
npm run build 
npm run start
```

---

##  API Documentation

### Base URL

```
http://localhost:2030/api/v1
```

---

### 1. Save & Validate ESP Key

**Endpoint:**

```
POST /integrations
```

**Request Body:**

```json
{
  "provider": "mailchimp", 
  "apiKey": "abcd1234-us1"
}
```

**Response (success):**

```json
{
  "status": true,
  "message": "Integration saved and validated successfully",
  "data": {
    "_id": "65123abcd456ef7890123gh",
    "provider": "mailchimp",
    "apiKey": "****-us1",
    "createdAt": "2025-09-29T12:00:00.000Z"
  }
}
```

**Response (invalid key):**

```json
{
  "status": false,
  "error": "authentication_error",
  "message": "Invalid Mailchimp API key",
  "data": {}
}
```

---

### 2. Fetch Lists (Audiences / Campaigns)

**Endpoint:**

```
GET /integrations/lists?provider=mailchimp
```

**Response (Mailchimp example):**

```json
{
  "status": true,
  "message": "Lists fetched successfully",
  "data": [
    { "id": "b12345", "name": "Newsletter Subscribers" },
    { "id": "c67890", "name": "VIP Customers" }
  ]
}
```

**Response (GetResponse example):**

```json
{
  "status": true,
  "message": "Lists fetched successfully",
  "data": [
    { "campaignId": "xyz123", "name": "Summer Promo" },
    { "campaignId": "lmn456", "name": "Welcome Series" }
  ]
}
```

## Database Schema

### `Integration`

```ts
{
  _id: ObjectId,
  provider: "mailchimp" | "getresponse",
  apiKey: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

##  Error Handling

All errors follow a consistent structure:

```json
{
  "status": false,
  "error": "server_error",
  "message": "Internal server error. Please try again later or contact support if the issue persists",
  "data": "Detailed  message"
}
```

---

## 👤 Author

Chinasa Acha – [LinkedIn](https://www.linkedin.com/in/chinasa-acha) | [GitHub](https://github.com/chinasa056)

---