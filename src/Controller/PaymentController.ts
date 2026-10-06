import express from "express";
import {OrderModel} from "../Model/Order.js";
import {PaymentModel} from "../Model/Payment.js";

class PaymentController {


    createPayment = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { orderId } = request.params;
            const { method } = request.body;

            const allowedMethods = [
                "MOMO",
                "CARD",
                "BANK_TRANSFER",
            ];

            if (!allowedMethods.includes(method)) {
                return response.status(400).json({
                    message: "Invalid payment method",
                });
            }

            const order = await OrderModel.findById(orderId);

            if (!order) {
                return response.status(404).json({
                    message: "Order not found",
                });
            }

            if (order.status === "CANCELLED") {
                return response.status(400).json({
                    message: "Cannot pay for a cancelled order",
                });
            }

            const existingPayment = await PaymentModel.findOne({
                order: orderId,
                status: { $in: ["PENDING", "SUCCESS"] },
            });

            if (existingPayment) {
                return response.status(400).json({
                    message: "A pending or successful payment already exists",
                    data: existingPayment,
                });
            }

            const payment = new PaymentModel({
                order: orderId,
                customer: order.customer,
                amount: order.totalAmount,
                method,
                status: "SUCCESS",
            });

            await payment.save();

            return response.status(201).json({
                message: "Payment record created successfully",
                data: payment,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to create payment",
                error,
            });
        }
    };



    getAllPayments = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const payments = await PaymentModel.find()
                .populate("order")
                .populate("customer");

            return response.status(200).json({
                data: payments,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get payments",
                error,
            });
        }
    };



    getPayment = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const payment = await PaymentModel.findById(id)
                .populate("order")
                .populate("customer");

            if (!payment) {
                return response.status(404).json({
                    message: "Payment not found",
                });
            }

            return response.status(200).json({
                data: payment,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get payment",
                error,
            });
        }
    };


    getOrderPayment = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { orderId } = request.params;

            const payment = await PaymentModel.findOne({
                order: orderId,
            })
                .populate("order")
                .populate("customer");

            if (!payment) {
                return response.status(404).json({
                    message: "Payment not found for this order",
                });
            }

            return response.status(200).json({
                data: payment,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to get order payment",
                error,
            });
        }
    };

    getCustomerPayments = async (req:express.Request, res:express.Response) => {
        try{
            const {id} = req.params;
            const customerPayments = await PaymentModel.find({customer:id})
            res.status(200).json({message:"Customer payments", customerPayments})
        }catch(error){
            res.status(500).json({message: "Failed to get customer payments",})
        }
}



}

export default new PaymentController();