import { body, param } from "express-validator";
import { productExists, nameProductExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("name").custom(nameProductExists),
    body("text").notEmpty().withMessage("El texto es requerido"),
    body("price").notEmpty().withMessage("El precio es requerido."),
    validarCampos,
    handleErrors
]

export const getProductValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
]

export const getProductMoreSellerValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    validarCampos,
    handleErrors
]

export const getProductNameValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("CLIENT_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    handleErrors
]

export const getProductfilterCategoryValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("CLIENT_ROLE"),
    validarCampos,
    handleErrors
]


export const getProductByIdValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(productExists),
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
]

export const deleteProductValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(productExists),
    validarCampos,
    handleErrors
]


export const updateProductValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("id", "No es un ID válido").isMongoId(),
    param("id").custom(productExists),
    validarCampos,
    handleErrors
]


