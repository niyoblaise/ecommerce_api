import express from "express";
import {ProductModel} from "../Model/Product.js";

class ProductController {

    createProduct = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const {
                name,
                description,
                price,
                stock,
                image,
                category,
                isAvailable,
            } = request.body;

            const product = new ProductModel({
                name,
                description,
                price,
                stock,
                image,
                category,
                isAvailable,
            });

            await product.save();


            const populatedProduct = await ProductModel
                .findById(product._id)
                .populate("category");

            return response.status(201).json({
                message: "Product created successfully",
                data: populatedProduct,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to create product",
                error,
            });
        }
    };


    getAllProducts = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const products = await ProductModel.find();

            return response.status(200).json({
                data: products,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to get products",
                error,
            });
        }
    };


    getProduct = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const product = await ProductModel.findById(id);

            if (!product) {
                return response.status(404).json({
                    message: "Product not found",
                });
            }

            return response.status(200).json({
                data: product,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to get product",
                error,
            });
        }
    };


    updateProduct = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const {
                name,
                description,
                price,
                stock,
                image,
                category,
                isAvailable,
            } = request.body;

            const product = await ProductModel.findById(id);

            if (!product) {
                return response.status(404).json({
                    message: "Product not found",
                });
            }

            product.name = name;
            product.description = description;
            product.price = price;
            product.stock = stock;
            product.image = image;
            product.category = category;
            product.isAvailable = isAvailable;

            await product.save();

            return response.status(200).json({
                message: "Product updated successfully",
                data: product,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to update product",
                error,
            });
        }
    };


    deleteProduct = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const product = await ProductModel.findByIdAndDelete(id);

            if (!product) {
                return response.status(404).json({
                    message: "Product not found",
                });
            }

            return response.status(200).json({
                message: "Product deleted successfully",
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to delete product",
                error,
            });
        }
    };


    searchProducts = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { name } = request.query;

            if (!name || typeof name !== "string") {
                return response.status(400).json({
                    message: "Search name is required"
                });
            }

            const products = await ProductModel.find({
                name: {
                    $regex: name,
                    $options: "i",
                },
            });

            return response.status(200).json({
                data: products
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to search products",
                error
            });
        }
    };

    getProductsByCategory = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { categoryId } = request.params;

            const products = await ProductModel.find({
                category: categoryId,
            });

            return response.status(200).json({
                data: products,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to get products by category",
                error,
            });
        }
    };



    updateStock = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;
            const { stock } = request.body;

            const product = await ProductModel.findById(id);

            if (!product) {
                return response.status(404).json({
                    message: "Product not found",
                });
            }

            product.stock = stock;

            await product.save();

            return response.status(200).json({
                message: "Stock updated successfully",
                data: product,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to update stock",
                error,
            });
        }
    };


    reduceStock = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;
            const { quantity } = request.body;

            const product = await ProductModel.findById(id);

            if (!product) {
                return response.status(404).json({
                    message: "Product not found",
                });
            }

            if (quantity <= 0) {
                return response.status(400).json({
                    message: "Quantity must be greater than 0",
                });
            }

            if (product.stock < quantity) {
                return response.status(400).json({
                    message: "Insufficient stock",
                });
            }

            product.stock = product.stock - quantity;

            await product.save();

            return response.status(200).json({
                message: "Stock reduced successfully",
                data: product,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Failed to reduce stock",
                error,
            });
        }
    };
}

export default new ProductController();