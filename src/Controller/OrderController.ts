import express from "express";
import {CustomerModel} from "../Model/Customer.js";
import {ProductModel} from "../Model/Product.js";
import {OrderModel} from "../Model/Order.js";
import {CartModel} from "../Model/Cart.js";


class OrderController {

    createOrder = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { customerId } = request.params;
            const { deliveryAddress } = request.body;

            if (!deliveryAddress || typeof deliveryAddress !== "string") {
                return response.status(400).json({
                    message: "Delivery address is required",
                });
            }

            const customer = await CustomerModel.findById(customerId);

            if (!customer) {
                return response.status(404).json({
                    message: "Customer not found",
                });
            }

            const cart = await CartModel.findOne({
                customer: customerId,
            });

            if (!cart || cart.items.length === 0) {
                return response.status(400).json({
                    message: "Cart is empty or not found",
                });
            }

            const orderItems = [];
            let totalAmount = 0;

            for (const item of cart.items) {
                const product = await ProductModel.findById(item.product);

                if (!product) {
                    return response.status(404).json({
                        message: "A product in the cart no longer exists",
                    });
                }

                if (!product.isAvailable || product.stock < item.quantity) {
                    return response.status(400).json({
                        message: `Insufficient stock for ${product.name}`,
                    });
                }

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                });

                totalAmount += product.price * item.quantity;
            }

            const order = new OrderModel({
                customer: customerId,
                items: orderItems,
                totalAmount,
                deliveryAddress,
            });

            await order.save();

            cart.items.splice(0, cart.items.length);
            await cart.save();

            const populatedOrder = await OrderModel.findById(order._id)
                .populate("customer")
                .populate("items.product");

            return response.status(201).json({
                message: "Order created successfully",
                data: populatedOrder,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to create order",
                error,
            });
        }
    };


    getAllOrders = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const orders = await OrderModel.find()
                .populate("customer")
                .populate("items.product");

            return response.status(200).json({
                data: orders,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get orders",
                error,
            });
        }
    };



    getOrder = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const order = await OrderModel.findById(id)
                .populate("customer")
                .populate("items.product");

            if (!order) {
                return response.status(404).json({
                    message: "Order not found",
                });
            }

            return response.status(200).json({
                data: order,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get order",
                error,
            });
        }
    };



    getCustomerOrders = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { customerId } = request.params;

            const orders = await OrderModel.find({
                customer: customerId,
            })
                .populate("customer")
                .populate("items.product");

            return response.status(200).json({
                data: orders,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get customer orders",
                error,
            });
        }
    };



    updateOrderStatus = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;
            const { status } = request.body;

            const allowedStatuses = [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
            ];

            if (!allowedStatuses.includes(status)) {
                return response.status(400).json({
                    message: "Invalid order status",
                });
            }

            const order = await OrderModel.findById(id);

            if (!order) {
                return response.status(404).json({
                    message: "Order not found",
                });
            }

            if (order.status === "CANCELLED") {
                return response.status(400).json({
                    message: "Cancelled orders cannot be updated",
                });
            }

            order.status = status;
            await order.save();

            return response.status(200).json({
                message: "Order status updated successfully",
                data: order,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to update order status",
                error,
            });
        }
    };



    cancelOrder = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const order = await OrderModel.findById(id);

            if (!order) {
                return response.status(404).json({
                    message: "Order not found",
                });
            }

            if (order.status !== "PENDING") {
                return response.status(400).json({
                    message: "Only pending orders can be cancelled",
                });
            }

            order.status = "CANCELLED";
            await order.save();

            return response.status(200).json({
                message: "Order cancelled successfully",
                data: order,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to cancel order",
                error,
            });
        }
    };
}

export default new OrderController();