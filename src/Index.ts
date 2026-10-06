import express from "express";
import connectDB from "./config/Database.js";
import productRoutes from "./Routes/productRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import customerRoutes from "./Routes/customerRoutes.js";
import authRouter from "./Routes/authRouter.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/Swagger.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

startServer();