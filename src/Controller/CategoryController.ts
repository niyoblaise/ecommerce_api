import express from "express";
import {CategoryModel} from "../Model/Category.js";

class CategoryController {

    createCategory = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { name, description } = request.body;

            const category = new CategoryModel({
                name,
                description,
            });

            await category.save();

            return response.status(201).json({
                message: "Category created successfully",
                data: category,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to create category",
                error,
            });
        }
    };


    getAllCategories = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const categories = await CategoryModel.find();

            return response.status(200).json({
                data: categories,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to get categories",
                error,
            });
        }
    };


    getCategory = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const category = await CategoryModel.findById(id);

            if (!category) {
                return response.status(404).json({
                    message: "Category not found",
                });
            }

            return response.status(200).json({
                data: category,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to get category",
                error,
            });
        }
    };


    updateCategory = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;
            const { name, description } = request.body;

            const category = await CategoryModel.findById(id);

            if (!category) {
                return response.status(404).json({
                    message: "Category not found",
                });
            }

            category.name = name;
            category.description = description;

            await category.save();

            return response.status(200).json({
                message: "Category updated successfully",
                data: category,
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to update category",
                error,
            });
        }
    };


    deleteCategory = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { id } = request.params;

            const category = await CategoryModel.findByIdAndDelete(id);

            if (!category) {
                return response.status(404).json({
                    message: "Category not found",
                });
            }

            return response.status(200).json({
                message: "Category deleted successfully",
            });

        } catch (error) {
            return response.status(500).json({
                message: "Failed to delete category",
                error,
            });
        }
    };
}

export default new CategoryController();