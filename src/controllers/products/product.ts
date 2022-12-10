import { Response, Request, NextFunction } from "express";
import { Product } from "../../models/product";
import User from "../../models/user";
const jwt = require("jsonwebtoken");

import { IProduct } from "../../types/product";
import { cloudinary } from "../../utils/image-upload";



const getAllProducts = async (req: Request, res: Response): Promise<void> => {  // <--- Notice the return type of Promise<void> which means that this function will return a promise that will resolve to void (nothing)
    try {

        const products: IProduct[] = await Product.find().populate("user_id"); // <--- populate is a mongoose method that allows you to populate a field with the data from another collection
        res.status(200).json({ products });
        return;
    } catch (error) {
        throw error;
    }
};


const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


    try {

        // decode the token and get the user id
        const decoded = jwt.verify(req.headers.authorization?.split(" ")[1], process.env.JWT_SECRET);

        console.log({ "decoded ============================": decoded });

        const user = await User.findOne({ _id: decoded.user_id });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const user_id = user._id;

        const body = req.body as Pick<IProduct, "name" | "price" | "description" | "category">;  // <--- Pick is a generic type that allows you to select which properties you want to use from the IProduct interface
        const images = req.files as Express.Multer.File[]; // <--- req.files is an array of Express.Multer.File objects

        // upload images to cloudinary
        const imagesUrls = await Promise.all(images.map(async (image) => {
            const { path } = image;
            const newPath = await cloudinary.uploader.upload(path);
            return newPath.url;

        }));


        //validate the data
        if (!body.name || !body.price || !body.description || !body.category) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }


        const product: IProduct = new Product({
            name: body.name,
            price: body.price,
            description: body.description,
            category: body.category,
            images: imagesUrls,
            user_id,
        });

        const newProduct: IProduct = await product.save();
        const allProducts: IProduct[] = await Product.find();

        res.status(201).json({
            message: "Product added",
            product: newProduct,
            products: allProducts,
        });


    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        let { name, price, description, category } = req.body;

        const images = req.files as Express.Multer.File[]; // <--- req.files is an array of Express.Multer.File objects

        // upload images to cloudinary
        const imagesUrls = await Promise.all(images?.map(async (image) => {
            const { path } = image;
            const newPath = await cloudinary.uploader.upload(path);
            return newPath.url;
        }
        ));

        console.log({ imagesUrls })

        const product: IProduct | null = await Product.findByIdAndUpdate(
            {
                _id: id,
            },
            {
                name,
                price,
                description,
                category,
                images: imagesUrls,
            },
            { new: true }
        );

        const allProducts: IProduct[] = await Product.find(); // IProduct[] is an array of IProduct objects

        res.status(200).json({
            message: "Product updated",
            product,
            products: allProducts,
        });



    } catch (error) {
        console.log(error);
        next(error);  // <--- next is a function that will pass the error to the error handler middleware in the main entry point of the application
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       
        const { id } = req.params;
        const product: IProduct | null = await Product.findByIdAndDelete({
            _id: id,
        });

        const allProducts: IProduct[] = await Product.find();

        res.status(200).json({
            message: "Product deleted",
            product,
            products: allProducts,
        });

     
    } catch (error) {
        next(error);
    }
};

const getSingleProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { params: { id } } = req;
        const product: IProduct | null = await Product.findById({ _id: id });

        // handle if product is not found
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(product ? 200 : 404).json({ product });
    } catch (error) {
        next(error);
    }
};

// get all products aggregated by category
const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products: IProduct[] = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" },
                },
            },
        ]);

        res.status(200).json({ products });
    } catch (error) {
        next(error);
    }
};



export { getAllProducts, addProduct, updateProduct, deleteProduct, getSingleProduct, getProductsByCategory };


