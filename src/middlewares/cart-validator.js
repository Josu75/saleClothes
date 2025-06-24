import { body, param } from "express-validator";
import { cartExists, nameCartExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("CLIENT_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("name").custom(nameCartExists),
    validarCampos,
    handleErrors
]

export const deleteProductValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("CLIENT_ROLE"),
    validarCampos,
    handleErrors
]

export const ProductListValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("CLIENT_ROLE"),
    validarCampos,
    handleErrors
]