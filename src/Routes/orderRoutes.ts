import express from "express";
import OrderController from "../Controller/OrderController.js";
import {authenticate} from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(authenticate)
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Create and manage customer orders
 */

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   post:
 *     summary: Create an order from a customer's cart
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deliveryAddress]
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *                 example: Kigali, Rwanda
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Empty cart or insufficient stock
 *       404:
 *         description: Customer or product not found
 *   get:
 *     summary: Get a customer's orders
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer orders retrieved
 */
router.post("/customer/:customerId", OrderController.createOrder);
router.get("/customer/:customerId", OrderController.getCustomerOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved
 */
router.get("/", OrderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved
 *       404:
 *         description: Order not found
 */
router.get("/:id", OrderController.getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED]
 *                 example: PROCESSING
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status or cancelled order
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", OrderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel a pending order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 *       400:
 *         description: Order cannot be cancelled
 *       404:
 *         description: Order not found
 */
router.patch("/:id/cancel", OrderController.cancelOrder);

export default router;