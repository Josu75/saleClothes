import { Router } from "express"
import { register, login} from "./auth.controller.js"
import { registerValidator, loginValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router()

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nombre del usuario (máximo 25 caracteres).
 *                 example: "Juan"
 *               surname:
 *                 type: string
 *                 description: El apellido del usuario (máximo 25 caracteres).
 *                 example: "Pérez"
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único.
 *                 example: "juanperez"
 *               email:
 *                 type: string
 *                 description: Dirección de correo electrónico del usuario (debe ser único).
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "123456789"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario.
 *               phone:
 *                 type: string
 *                 description: Número de teléfono (debe tener 8 caracteres).
 *                 example: "58496741"
 *               role:
 *                 type: string
 *                 description: Rol del usuario (debe ser "USER_ROLE" o "ADMIN_ROLE").
 *                 enum: ["USER_ROLE", "ADMIN_ROLE"]
 *                 example: "USER_ROLE"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente."
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     surname:
 *                       type: string
 *                       example: "Pérez"
 *                     username:
 *                       type: string
 *                       example: "juanperez"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     profilePicture:
 *                       type: string
 *                       example: "url_del_perfil.jpg"
 *                     phone:
 *                       type: string
 *                       example: "58496741"
 *                     role:
 *                       type: string
 *                       example: "USER_ROLE"
 *       400:
 *         description: Datos incorrectos o solicitud mal formada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos incorrectos, por favor verifique los campos."
 *       409:
 *         description: Conflicto debido a datos duplicados (como email o username).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El correo o el nombre de usuario ya están en uso."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al registrar el usuario. Intente nuevamente."
 */



router.post(
    "/register",
    uploadProfilePicture.single("profilePicture"), 
    registerValidator, 
    register
)
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en la solicitud
 */


router.post(
    "/login",
    loginValidator,
    login
)

export default router