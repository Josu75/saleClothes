"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import categoryRoutes from "../src/category/category.routes.js"
import productRoutes from "../src/product/product.routes.js"
import cartRoutes from "../src/cart/cart.routes.js"
import apiLimiter from "../src/middlewares/rate-limit-validator.js"
import { swaggerDocs, swaggerUi } from "./swagger.js"

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors({
        origin: '*', // Permitir todas las solicitudes de origen
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", `http://localhost:${process.env.PORT}`],
                connectSrc: ["'self'", `http://localhost:${process.env.PORT}`],
                imgSrc: ["'self'", "data:"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    }));
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/salesManager/v1/auth", authRoutes)
    app.use("/salesManager/v1/user", userRoutes)
    app.use("/salesManager/v1/category", categoryRoutes)
    app.use("/salesManager/v1/product", productRoutes)
    app.use("/salesManager/v1/cart", cartRoutes)
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

const conectarDB = async () => {
    try {
        await dbConnection()
    } catch (err) {
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initServer = () => {
    const app = express()
    try {
        middlewares(app)
        conectarDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`)
    }
}