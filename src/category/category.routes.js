import { Router } from "express"
import {getCategories, createCategories, deleteCategory, updateCategory } from "./category.controller.js"
import { createValidator, getCategoriesValidator, deleteCategoriesValidator, updateCategoriesValidator } from "../middlewares/category-validators.js"

const router = Router()

/**
 * @swagger
 * /createCategories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tecnología"
 *               description:
 *                 type: string
 *                 example: "Categoría dedicada a temas tecnológicos"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos o falta información
 *       500:
 *         description: Error interno del servidor
 */


router.post("/createCategories", createValidator, createCategories)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene una lista de todas las categorías
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categorías obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109f1"
 *                   name:
 *                     type: string
 *                     example: "Tecnología"
 *                   description:
 *                     type: string
 *                     example: "Categoría dedicada a temas tecnológicos"
 *                   status:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Error interno del servidor
 */




router.get("/", getCategoriesValidator, getCategories)


/**
 * @swagger
 * /updateCategories/{id}:
 *   put:
 *     summary: Actualiza una categoría existente por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109f1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ciencias"
 *               description:
 *                 type: string
 *                 example: "Categoría dedicada a temas de ciencias naturales"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.put("/updateCategories/:id", updateCategoriesValidator, updateCategory)

/**
 * @swagger
 * /deleteCategories/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109f1"
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.delete("/deleteCategories/:id", deleteCategoriesValidator, deleteCategory)



export default router

