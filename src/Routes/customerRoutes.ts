import express from "express";
import CustomerController from "../Controller/CustomerController.js";
import {authenticate} from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(authenticate)
/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manage customer records
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, phone, address]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Blaise
 *               lastName:
 *                 type: string
 *                 example: Niyonshuti
 *               email:
 *                 type: string
 *                 format: email
 *                 example: niyoblaise@gmail.com
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               address:
 *                 type: string
 *                 example: Kigali, Rwanda
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Invalid customer data
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customers retrieved
 */
router.post("/", CustomerController.createCustomer);
router.get("/", CustomerController.getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer retrieved
 *       404:
 *         description: Customer not found
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Blaise
 *               lastName:
 *                 type: string
 *                 example: Niyonshuti
 *               email:
 *                 type: string
 *                 example: niyoblaise@gmail.com
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               address:
 *                 type: string
 *                 example: Kigali, Rwanda
 *     responses:
 *       200:
 *         description: Customer updated
 *       404:
 *         description: Customer not found
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.get("/:id", CustomerController.getCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;