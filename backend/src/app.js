import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import { ApiError } from './utils/ApiError.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀"
  });
});
// http://localhost:8000/api/v1/users/register


// Global error handler - Must be after all routes
app.use((err, req, res, next) => {
    // If it's our custom ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            success: false,
            errors: err.errors,
            data: null,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // For any other errors
    console.error('Unhandled Error:', err);
    return res.status(500).json({
        statusCode: 500,
        message: err.message || 'Internal Server Error',
        success: false,
        errors: [],
        data: null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler - for routes that don't exist
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
        success: false,
        errors: [],
        data: null
    });
});

export { app }