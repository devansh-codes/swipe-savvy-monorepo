// --- Import Required Libraries ---
// 'express' is the core framework for building the server
import express from 'express';
// 'pg' is the library (driver) to connect to our PostgreSQL database
import pg from 'pg';
// 'cors' is a middleware to allow our frontend to make requests to this backend
import cors from 'cors';
// 'dotenv' allows us to use a .env file for secret credentials
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// --- Initialize the Application ---
const app = express();
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001

// --- Middleware Setup ---
// Enable CORS for all routes, so our React app can communicate with this server
app.use(cors());
// Allow the server to understand JSON formatted request bodies
app.use(express.json());

// --- Database Connection Setup ---
// The Pool is a more efficient way to handle database clients
const { Pool } = pg;

// Create a new Pool instance to manage connections to the database.
// It will automatically use the environment variables PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT
// You must create a .env file in this backend folder with these values.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // If you are connecting to a database that requires SSL (like Heroku, Render, etc.) add this:
    // ssl: {
    //   rejectUnauthorized: false
    // }
});

// --- API Routes ---
// This is a simple test route to make sure the server is running
app.get('/api', (req, res) => {
    res.status(200).json({ message: "Backend server is running successfully!" });
});

/**
 * API Endpoint to get a list of all businesses.
 * In a real app, this might be used for an admin dashboard.
 */
app.get('/api/businesses', async (req, res) => {
    try {
        // This query assumes you have a table named 'businesses'
        const result = await pool.query('SELECT * FROM businesses');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * API Endpoint to register a new business.
 * This is what the frontend form will call.
 */
app.post('/api/register', async (req, res) => {
    // Destructure the required fields from the request body
    const { businessName, businessAddress, fullName, email, mobile, password, website } = req.body;

    // Basic validation to ensure required fields are present
    if (!businessName || !fullName || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // In a real app, you would hash the password here before saving it.
    // For example, using a library like bcrypt.
    // const hashedPassword = await bcrypt.hash(password, 10);

    const queryText = `
        INSERT INTO businesses (name, address, owner_name, email, phone, website, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
    `;
    // Note: We are saving the plain password here for simplicity. DO NOT DO THIS IN PRODUCTION.
    const values = [businessName, businessAddress, fullName, email, mobile, password, website];

    try {
        const result = await pool.query(queryText, values);
        console.log('Business registered:', result.rows[0]);
        // Send back the newly created business record
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering business:', error);
        // Handle potential duplicate email error
        if (error.code === '23505') { // '23505' is the PostgreSQL code for unique_violation
            return res.status(409).json({ error: 'A business with this email already exists.' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
