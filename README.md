# Swipe Savvy - Freemium Loyalty Platform

Swipe Savvy is a full-stack web application designed as a freemium loyalty and rewards platform for small businesses. It features a multi-step, responsive onboarding flow for merchants to register their business and manage their listing.

This repository contains the complete monorepo, including both the frontend and backend services.

---

## Tech Stack

| Service  | Technology                               |
| :------- | :--------------------------------------- |
| **Frontend** | React, Tailwind CSS, Lucide React        |
| **Backend** | Node.js, Express.js                      |
| **Database** | PostgreSQL                               |

---

## Project Structure

This project is a monorepo containing two separate applications:

-   `./frontend`: The customer-facing React application that handles the user interface and onboarding flow.
-   `./backend`: The Node.js (Express) server that manages API logic, database interactions, and business rules.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm (v9 or later)
-   PostgreSQL installed and running on your machine or a cloud service.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/swipe-savvy-monorepo.git](https://github.com/YOUR_USERNAME/swipe-savvy-monorepo.git)
    cd swipe-savvy-monorepo
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

4.  **Database Setup:**
    * Create a PostgreSQL database.
    * Create a `.env` file inside the `./backend` directory.
    * Add your database connection string to the `.env` file:
        ```
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
        ```
    * Connect to your database and run the SQL script located in `backend/database.sql` (or a similar file) to create the necessary tables.

### Running the Application

You must have **two separate terminals** open to run the full application.

1.  **Run the Backend Server:**
    * Navigate to the backend directory and start the server.
    ```bash
    cd backend
    node server.js
    ```
    * The server will be running on `http://localhost:3001`.

2.  **Run the Frontend Application:**
    * In a new terminal, navigate to the frontend directory and start the React app.
    ```bash
    cd frontend
    npm start
    ```
    * The application will open automatically in your browser at `http://localhost:3000`.
