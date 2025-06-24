import { Router } from "express"
import { getUserById, getUsers, updatePassword, updateUser, updateProfilePicture, deleteUser, updateOtherUser, deleteOtherUser, deleteProfilePicture } from "./user.controller.js"
import { getUserByIdValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator, deleteValidator, updateOtherUserValidator, deleteOtherUserValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()


/**
 * @swagger
 * /findUser:
 *   get:
 *     summary: Obtiene los detalles del usuario autenticado
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "John"
 *                     surname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "12345678"
 *                     role:
 *                       type: string
 *                       enum: [USER_ROLE, ADMIN_ROLE]
 *                       example: "USER_ROLE"
 *       401:
 *         description: No autorizado, token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */



router.get("/findUser", getUserByIdValidator, getUserById)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limite
 *         description: Número de usuarios por página (opcional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: desde
 *         description: El índice de inicio para la paginación (opcional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 100  # Total de usuarios en la base de datos
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109f1"
 *                       name:
 *                         type: string
 *                         example: "Juan"
 *                       surname:
 *                         type: string
 *                         example: "Perez"
 *                       username:
 *                         type: string
 *                         example: "juanperez"
 *                       email:
 *                         type: string
 *                         example: "juanperez@gmail.com"
 *                       phone:
 *                         type: string
 *                         example: "58496741"
 *                       role:
 *                         type: string
 *                         enum: ["USER_ROLE", "ADMIN_ROLE"]
 *                         example: "USER_ROLE"
 *                       status:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Error interno del servidor
 */


router.get("/", getUsers)



/**
 * @swagger
 * /updatePassword:
 *   patch:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username1"
 *               beforePassword:
 *                 type: string
 *                 example: "12345678ASddadaw$%s"
 *               newPassword:
 *                 type: string
 *                 example: "12345678AADS$asdfasf%"
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada"
 *       400:
 *         description: La contraseña anterior es incorrecta o la nueva contraseña no cumple con los requisitos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "La contraseña actual es incorrecta"
 *       403:
 *         description: No tienes permisos para actualizar la contraseña de este usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para cambiar la contraseña a otro usuario que no sea el tuyo."
 *       404:
 *         description: Usuario no encontrado o contraseña anterior no proporcionada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno al actualizar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar contraseña"
 */


router.patch("/updatePassword", updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               beforeUsername:
 *                 type: string
 *                 example: "usuarioActual"
 *               name:
 *                 type: string
 *                 example: "NuevoNombre"
 *               surname:
 *                 type: string
 *                 example: "NuevoApellido"
 *               username:
 *                 type: string
 *                 example: "nuevoUsername"
 *               email:
 *                 type: string
 *                 example: "nuevoEmail@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *               role:
 *                 type: string
 *                 enum: [CLIENT_ROLE, ADMIN_ROLE]
 *                 example: "CLIENT_ROLE"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Usuario Actualizado"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65a2bc3de4f56789012gh345"
 *                     name:
 *                       type: string
 *                       example: "NuevoNombre"
 *                     surname:
 *                       type: string
 *                       example: "NuevoApellido"
 *                     username:
 *                       type: string
 *                       example: "nuevoUsername"
 *                     email:
 *                       type: string
 *                       example: "nuevoEmail@gmail.com"
 *                     phone:
 *                       type: string
 *                       example: "123456789"
 *                     role:
 *                       type: string
 *                       example: "CLIENT_ROLE"
 *       400:
 *         description: Datos incorrectos o rol no permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Tu solamente puedes ser: CLIENT_ROLE"
 *       403:
 *         description: No tienes permisos para actualizar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para actualizar a otro admin."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno al actualizar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Error al actualizar usuario"
 *                 error:
 *                   type: string
 *                   example: "Detalles del error"
 */


router.put("/updateUser", updateUserValidator, updateUser)


/**
 * @swagger
 * /updateProfilePicture:
 *   patch:
 *     summary: Actualiza la foto de perfil de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         required: true
 *         description: La nueva foto de perfil del usuario
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada con éxito
 *       400:
 *         description: El archivo no es válido o no se pudo procesar
 *       500:
 *         description: Error al actualizar la foto de perfil
 */
router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture)

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Elimina un usuario (cambia su estado a inactivo)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "usuario123"
 *               Password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente (estado cambiado a inactivo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado"
 *       400:
 *         description: La contraseña proporcionada es incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "La contraseña actual es incorrecta"
 *       403:
 *         description: No tienes permisos para eliminar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para eliminar este usuario"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno al eliminar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al eliminar el usuario"
 */


router.delete("/deleteUser", deleteValidator, deleteUser)

router.put("/updateUser/:uid", updateOtherUserValidator, updateOtherUser)

router.delete("/deleteUser/:uid", deleteOtherUserValidator, deleteOtherUser)

router.delete("/deleteProfilePicture", getUserByIdValidator, deleteProfilePicture);

export default router