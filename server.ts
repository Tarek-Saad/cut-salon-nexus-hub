import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  pool,
  testConnection,
  warmConnection,
  healthCheck,
  isConnected,
} from "./lib/db";
import { EmployeeService } from "./services/employeeService";
import employeeRoutes from "./routes/employees";

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.method !== "GET" && Object.keys(req.body).length > 0) {
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// Fallback mode indicator middleware
app.use((req, res, next) => {
  if (EmployeeService.isFallbackMode()) {
    res.setHeader("X-Fallback-Mode", "true");
    res.setHeader("X-Fallback-Reason", "Database connection unavailable");
  }
  next();
});

// Response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400) {
      console.log(`[ERROR] ${res.statusCode} - ${req.method} ${req.path}`);
      console.log("Response:", body);
    }
    return originalSend.call(this, body);
  };
  next();
});

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    const connected = await testConnection();

    if (connected) {
      console.log("✅ Database connected successfully!");

      // Test basic queries
      try {
        const result = await pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('employees', 'attendance', 'financial_transactions')
          ORDER BY table_name
        `);

        const existingTables = result.rows.map((row) => row.table_name);
        console.log("📊 Available tables:", existingTables);

        const requiredTables = [
          "employees",
          "attendance",
          "financial_transactions",
        ];
        const missingTables = requiredTables.filter(
          (table) => !existingTables.includes(table)
        );

        if (missingTables.length > 0) {
          console.warn("⚠️ Missing tables:", missingTables);
          console.warn("Please run the database setup SQL script first.");
          console.warn('psql "your-connection-string" -f database.sql');
        }

        // Test employee count if employees table exists
        if (existingTables.includes("employees")) {
          try {
            const countQuery =
              "SELECT COUNT(*) as employee_count FROM employees WHERE is_active = true";
            const countResult = await pool.query(countQuery);
            console.log(
              "👥 Active employees:",
              countResult.rows[0].employee_count
            );
          } catch (error) {
            console.warn("⚠️ Could not count employees:", error.message);
          }
        }
      } catch (error) {
        console.warn("⚠️ Could not verify database schema:", error.message);
      }
    } else {
      console.warn("⚠️ Database connection failed!");

      if (process.env.NODE_ENV === "development") {
        console.warn("🔄 Running in FALLBACK MODE with mock data");
        console.warn("📝 API will work with limited functionality");
        console.warn("💡 To fix: Check your DATABASE_URL in .env file");
      } else {
        console.error("❌ Cannot start server without database in production");
        process.exit(1);
      }
    }

    return connected;
  } catch (error) {
    console.error("❌ Database connection test failed:", error.message);

    if (process.env.NODE_ENV === "development") {
      console.warn("🔄 Continuing in FALLBACK MODE");
      return false;
    } else {
      console.error("❌ Cannot start server without database in production");
      process.exit(1);
    }
  }
}

// Routes

// Health check endpoint مع معلومات fallback
app.get("/health", async (req, res) => {
  try {
    const health = await healthCheck();
    const fallbackMode = EmployeeService.isFallbackMode();

    res.json({
      status: fallbackMode ? "degraded" : "OK",
      message: fallbackMode
        ? "Employee Management API running in fallback mode"
        : "Employee Management API is running normally",
      database: health.database,
      fallback_mode: fallbackMode,
      timestamp: new Date().toISOString(),
      server_time: new Date().toISOString(),
      db_time: health.timestamp,
      version: "1.0.0",
      pool_stats: health.pool_stats,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Health check failed",
      fallback_mode: EmployeeService.isFallbackMode(),
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Database test endpoint محسن
app.get("/api/test-db", async (req, res) => {
  try {
    console.log("🧪 Running comprehensive database test...");

    const fallbackMode = EmployeeService.isFallbackMode();

    if (fallbackMode) {
      return res.json({
        status: "fallback",
        connection: "DISCONNECTED",
        fallback_mode: true,
        message: "Database unavailable - using fallback data",
        timestamp: new Date().toISOString(),
        fallback_data: {
          employees: 5,
          mock_mode: true,
        },
      });
    }

    // Full database test
    const timeResult = await pool.query("SELECT NOW() as current_time");

    // Check tables
    const tablesQuery = `
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('employees', 'attendance', 'financial_transactions')
      ORDER BY table_name
    `;
    const tablesResult = await pool.query(tablesQuery);

    // Check employee data
    let employeeStats = null;
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_employees,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_employees,
          COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_employees
        FROM employees
      `;
      const statsResult = await pool.query(statsQuery);
      employeeStats = statsResult.rows[0];
    } catch (error) {
      employeeStats = { error: "Employees table not accessible" };
    }

    res.json({
      status: "success",
      connection: "OK",
      fallback_mode: false,
      timestamp: timeResult.rows[0].current_time,
      tables: tablesResult.rows,
      employee_stats: employeeStats,
      pool_stats: {
        total_count: pool.totalCount,
        idle_count: pool.idleCount,
        waiting_count: pool.waitingCount,
      },
      message: "Database test completed successfully",
    });

    console.log("✅ Database test completed successfully");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    res.status(500).json({
      status: "error",
      connection: "FAILED",
      fallback_mode: EmployeeService.isFallbackMode(),
      error: error.message,
      timestamp: new Date().toISOString(),
      message: "Database test failed",
    });
  }
});

// Connection status endpoint
app.get("/api/connection-status", async (req, res) => {
  const fallbackMode = EmployeeService.isFallbackMode();

  res.json({
    connected: isConnected,
    fallback_mode: fallbackMode,
    status: fallbackMode
      ? "degraded"
      : isConnected
      ? "healthy"
      : "disconnected",
    message: fallbackMode
      ? "Running with mock data - database unavailable"
      : isConnected
      ? "Database connected"
      : "Database disconnected",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/employees", employeeRoutes);

// Root endpoint مع معلومات fallback
app.get("/", (req, res) => {
  const fallbackMode = EmployeeService.isFallbackMode();

  res.json({
    message: "مرحباً بك في نظام إدارة الموظفين",
    status: fallbackMode ? "running in fallback mode" : "fully operational",
    fallback_mode: fallbackMode,
    api_version: "1.0.0",
    endpoints: {
      health: "/health",
      database_test: "/api/test-db",
      connection_status: "/api/connection-status",
      employees: "/api/employees",
      documentation: "قريباً...",
    },
    warnings: fallbackMode
      ? [
          "Database connection unavailable",
          "Using mock data for development",
          "Some features may be limited",
        ]
      : [],
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("💥 Unhandled error:", error);

    const fallbackMode = EmployeeService.isFallbackMode();

    // Database errors
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "البيانات مكررة",
        details: "هذا السجل موجود بالفعل",
        fallback_mode: fallbackMode,
        timestamp: new Date().toISOString(),
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "مرجع غير صحيح",
        details: "البيانات المرجعية غير موجودة",
        fallback_mode: fallbackMode,
        timestamp: new Date().toISOString(),
      });
    }

    // Connection errors
    if (error.message && error.message.includes("connection")) {
      return res.status(503).json({
        success: false,
        error: "مشكلة في الاتصال بقاعدة البيانات",
        details: fallbackMode
          ? "Running in fallback mode"
          : "Database connection lost",
        fallback_mode: fallbackMode,
        timestamp: new Date().toISOString(),
      });
    }

    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        details: error.message,
        fallback_mode: fallbackMode,
        timestamp: new Date().toISOString(),
      });
    }

    // Default error
    res.status(500).json({
      success: false,
      error: "خطأ داخلي في الخادم",
      details: error.message || "حدث خطأ غير متوقع",
      fallback_mode: fallbackMode,
      timestamp: new Date().toISOString(),
      request_id: req.headers["x-request-id"] || "unknown",
    });
  }
);

// 404 handler مع معلومات fallback
app.use("*", (req, res) => {
  const fallbackMode = EmployeeService.isFallbackMode();

  res.status(404).json({
    error: "المسار غير موجود",
    path: req.originalUrl,
    method: req.method,
    fallback_mode: fallbackMode,
    available_endpoints: [
      "GET /",
      "GET /health",
      "GET /api/test-db",
      "GET /api/connection-status",
      "GET /api/employees",
      "POST /api/employees",
      "PUT /api/employees/:id",
      "DELETE /api/employees/:id",
      "POST /api/employees/:id/attendance",
      "POST /api/employees/:id/transactions",
      "POST /api/employees/:id/settle",
    ],
    timestamp: new Date().toISOString(),
  });
});

// Start server function
async function startServer() {
  try {
    console.log("🚀 Starting Employee Management Server...");

    // Test database connection first
    const dbConnected = await testDatabaseConnection();

    if (!dbConnected && process.env.NODE_ENV === "development") {
      console.warn("=".repeat(60));
      console.warn("⚠️  RUNNING IN FALLBACK MODE");
      console.warn("=".repeat(60));
      console.warn("📝 The API will work with limited functionality");
      console.warn("🔧 To fix database connection:");
      console.warn("   1. Check your DATABASE_URL in .env file");
      console.warn("   2. Verify database server is running");
      console.warn("   3. Run: npm run test-db");
      console.warn("=".repeat(60));
    }

    // Warm up connection if available
    if (dbConnected) {
      await warmConnection();
    }

    const server = app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log("🎉 Server is running successfully!");
      console.log("=".repeat(50));
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🧪 Database Test: http://localhost:${PORT}/api/test-db`);
      console.log(
        `🔗 Connection Status: http://localhost:${PORT}/api/connection-status`
      );
      console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);

      if (EmployeeService.isFallbackMode()) {
        console.log("");
        console.log("⚠️  FALLBACK MODE ACTIVE");
        console.log("📊 Mock data available for testing");
        console.log("🔧 Fix database connection for full functionality");
      }

      console.log("=".repeat(50));
      console.log("📝 Server logs:");
    });

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Shutting down gracefully...");
  try {
    await pool.end();
    console.log("✅ Database connection closed.");
    console.log("👋 Server stopped. Goodbye!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Shutting down gracefully...");
  try {
    await pool.end();
    console.log("✅ Database connection closed.");
    console.log("👋 Server stopped. Goodbye!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
