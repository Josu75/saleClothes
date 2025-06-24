import { Router } from "express"
import { addToCart, removeProductFromCart, getCartById} from "./cart.controller.js"
import { createValidator, deleteProductValidator, ProductListValidator} from "../middlewares/cart-validator.js"

const router = Router()

/**
 * @swagger
 * /createCart:
 *   post:
 *     summary: Crear un nuevo carrito.
 *     description: Agrega productos al carrito de compras del usuario.
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: Los datos del carrito que se desean crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *             required:
 *               - name
 *               - products
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     user:
 *                       type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *       400:
 *         description: Error en la solicitud.
 *       500:
 *         description: Error al crear el carrito.
 */

router.post("/createCart", createValidator, addToCart)

/**
 * @swagger
 * /deleteCart:
 *   delete:
 *     summary: Eliminar un producto del carrito.
 *     description: Elimina un producto del carrito de compras del usuario.
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: Los datos del producto que se desean eliminar del carrito.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - product
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     user:
 *                       type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Carrito o producto no encontrado.
 *       500:
 *         description: Error al eliminar el producto del carrito.
 */

router.delete("/deleteCart", deleteProductValidator, removeProductFromCart)

/**
 * @swagger
 * /getCart:
 *   get:
 *     summary: Obtener el carrito del usuario.
 *     description: Obtiene el carrito de compras del usuario autenticado.
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     user:
 *                       type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *       404:
 *         description: Carrito no encontrado.
 *       500:
 *         description: Error al obtener el carrito.
 */

router.get("/getCart", ProductListValidator, getCartById)




export default router