import { Router } from "express"
import { createProduct, getProduct, getProductById, getProductOutStock, getProductMoreSeller, updateProduct, deleteProduct, getProductByName, getProductByCategory } from "./product.controller.js"
import { createValidator, getProductByIdValidator, getProductValidator, updateProductValidator, deleteProductValidator, getProductMoreSellerValidator, getProductNameValidator, getProductfilterCategoryValidator } from "../middlewares/product-validators.js"

const router = Router()

/**
 * @swagger
 * /createProduct:
 *   post:
 *     summary: Crear un nuevo producto.
 *     description: Solo los administradores pueden crear productos.
 *     tags:
 *       - Products
 *     requestBody:
 *       description: Los datos del producto que se desean crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               text:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - stock
 *               - price
 *               - category
 *     responses:
 *       200:
 *         description: Producto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stock:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     price:
 *                       type: number
 *                       format: float
 *                     category:
 *                       type: string
 *       403:
 *         description: Solo los administradores pueden crear productos.
 *       500:
 *         description: Error al crear el producto.
 */

router.post("/createProduct", createValidator, createProduct)


/**
 * @swagger
 * /getProduct:
 *   get:
 *     summary: Obtener todos los productos activos.
 *     description: Obtiene una lista de productos cuyo estado es verdadero (activos).
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Lista de productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   text:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   category:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Error al obtener los productos.
 */

router.get("/getProduct", getProductValidator, getProduct)


/**
 * @swagger
 * /getProductById/{id}:
 *   get:
 *     summary: Obtener un producto por ID.
 *     description: Obtiene los detalles de un producto según su ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 stock:
 *                   type: integer
 *                 text:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al obtener el producto.
 */


router.get("/getProductById/:id", getProductByIdValidator, getProductById)


/**
 * @swagger
 * /getProductOutOfStock:
 *   get:
 *     summary: Obtener los productos fuera de stock.
 *     description: Obtiene todos los productos que tienen el stock igual a cero.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Lista de productos agotados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   text:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   category:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Error al obtener los productos fuera de stock.
 */

router.get("/getProductOutOfStock", getProductValidator, getProductOutStock)

/**
 * @swagger
 * /getProductMoreSeller:
 *   get:
 *     summary: Obtener los productos más vendidos.
 *     description: Obtiene todos los productos ordenados por la cantidad vendida en orden descendente.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   text:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   soldQuantity:
 *                     type: integer
 *                   category:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Error al obtener los productos más vendidos.
 */


router.get("/getProductMoreSeller", getProductMoreSellerValidator, getProductMoreSeller)


/**
 * @swagger
 * /updateProduct/{id}:
 *   put:
 *     summary: Actualizar un producto.
 *     description: Permite a los administradores actualizar los detalles de un producto existente.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Los datos del producto que se desean actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               text:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - stock
 *               - price
 *               - category
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stock:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     price:
 *                       type: number
 *                       format: float
 *                     category:
 *                       type: string
 *       400:
 *         description: La categoría o los datos del producto no son válidos.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al actualizar el producto.
 */

router.put("/updateProduct/:id", updateProductValidator, updateProduct)

/**
 * @swagger
 * /deleteProduct/{id}:
 *   delete:
 *     summary: Eliminar un producto.
 *     description: "Marca un producto como eliminado (status: false)."
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stock:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     price:
 *                       type: number
 *                       format: float
 *                     category:
 *                       type: string
 *       404:
 *         description: Producto no encontrado.
 *       400:
 *         description: El producto ya ha sido eliminado.
 *       500:
 *         description: Error al eliminar el producto.
 */


router.delete("/deleteProduct/:id", deleteProductValidator, deleteProduct)

/**
 * @swagger
 * /getProductByName:
 *   get:
 *     summary: Obtener un producto por nombre.
 *     description: Obtiene los detalles de un producto según su nombre.
 *     tags:
 *       - Products
 *     requestBody:
 *       description: El nombre del producto que se desea obtener.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stock:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     price:
 *                       type: number
 *                       format: float
 *                     category:
 *                       type: string
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al obtener el producto.
 */

router.get("/getProductByName",getProductNameValidator, getProductByName)

/**
 * @swagger
 * /getProductByCategory:
 *   post:
 *     summary: Obtener productos por categoría.
 *     description: Obtiene una lista de productos según la categoría.
 *     tags:
 *       - Products
 *     requestBody:
 *       description: El nombre de la categoría para buscar productos.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *             required:
 *               - categoryName
 *     responses:
 *       200:
 *         description: Lista de productos en la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   text:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   category:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       404:
 *         description: Categoría no encontrada o no hay productos en esta categoría.
 *       500:
 *         description: Error al obtener los productos.
 */

router.post("/getProductByCategory", getProductfilterCategoryValidator, getProductByCategory)




export default router

