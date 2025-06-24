import { body, param } from "express-validator";
import { categoryExists, nameCategoryExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";


export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("name").custom(nameCategoryExists),
    validarCampos,
    handleErrors
]

export const getCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    validarCampos,
    handleErrors
]

export const deleteCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(categoryExists),
    validarCampos,
    handleErrors
]


export const updateCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("id", "No es un ID válido").isMongoId(),
    param("id").custom(categoryExists),
    validarCampos,
    handleErrors
]






