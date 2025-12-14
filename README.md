# 🌍 TravelCompanion — AI-Powered Trip Planner

TravelCompanion is a full-stack web application that helps users plan trips intelligently by combining traditional trip management with AI-generated travel suggestions.

Users can create trips, manage packing lists and itineraries, and leverage generative AI to receive personalized recommendations for places to visit and items to pack based on destination, travel dates, and trip duration.

---

## ✨ Features

### 🔐 Authentication
- Secure user authentication using JWT
- Login and registration
- Protected routes and user-specific data access

### 🧳 Trip Management
- Create trips with destination, start date, and end date
- Automatic trip duration calculation
- Ownership-based access control

### 📍 Places to Visit
- Add places manually or from AI suggestions
- Track visited/unvisited places
- Bulk add support

### ✅ Packing List
- Add packing items manually or from AI suggestions
- Track packed/unpacked status
- Bulk add support

### 🤖 AI Trip Assistant
- Generates suggested places and items
- Considers destination, dates, duration, and existing data
- One-click **Add All** functionality
- Strict JSON-only AI responses for reliable parsing

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion  
**Backend:** Spring Boot (Java), Spring Security, JPA
**Database:** MySQL  
**Authentication:** JWT  
**AI:** Generative AI (Spring AI with Google Gemini)

---

## 🏗️ Project Structure

```
TravelCompanion/
├── client/     # React frontend (Vite)
└── server/     # Spring Boot backend (Maven)
```

Frontend and backend are independently deployable.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v18 or higher recommended)
*   **Java Development Kit (JDK)**: The project is configured for **Java 25**.
    *   *Note:* If you do not have Java 25, you can try downgrading the version in `server/pom.xml` to Java 21 or 17, which should also be compatible with Spring Boot 3.4.
*   **MySQL Server**: Ensure it is running and you have credentials to create a database.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TravelCompanion
```

### 2. Backend Setup (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Create a MySQL database named `travelCompanion`:
    ```sql
    CREATE DATABASE travelCompanion;
    ```

3.  Create a `.env` file in the `server/` directory and add your configuration:
    ```env
    MYSQL_USER=your_mysql_username
    MYSQL_PASS=your_mysql_password
    MYSQL_HOST=localhost
    GOOGLE_API_KEY=your_google_gemini_api_key
    FRONTEND_URL=http://localhost:5173
    TRVLCOMP_JWT_SECRET=your_secure_jwt_secret_key
    ```
    *   Replace placeholders with your actual values.
    *   `FRONTEND_URL` should match the URL where your client app runs (default Vite port is 5173).

4.  Run the server:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will start on port **8080**.

### 3. Frontend Setup (Client)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  (Optional) Create a `.env` file in the `client/` directory if you need to override the API URL:
    ```env
    VITE_API_URL=http://localhost:8080
    ```
    *   By default, it connects to `http://localhost:8080`.

4.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will start on **http://localhost:5173** (or the port shown in your terminal).

---

## 💡 Usage

1.  Open your browser and go to `http://localhost:5173`.
2.  Register a new account.
3.  Log in and start creating trips!
4.  Use the AI assistant to generate packing lists and places to visit.

---

## 🚀 Deployment

- **Frontend:** Deploys easily to Netlify, Vercel, or any static site host.
- **Backend:** Ready for Railway, Render, AWS EC2, or any platform supporting Java Spring Boot.

Environment variables should be set in your deployment platform's dashboard.

---

## 👤 Author

**Hafil**  
Bachelor of Computer Science & Engineering  
Focused on full-stack development and applied AI systems

---

### 🔹 GitHub About
> AI-powered trip planning application built with React and Spring Boot, featuring smart itinerary and packing suggestions.
