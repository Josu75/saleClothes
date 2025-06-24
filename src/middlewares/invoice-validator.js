import { body, param } from "express-validator";
import { InvoiceExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createInvoiceValidator = [
    validateJWT,
    hasRoles("CLIENT_ROLE"),
    validarCampos,
    handleErrors
]

export const getInvoiceValidator = [
    validateJWT,
    hasRoles("CLIENT_ROLE"),
    validarCampos,
    handleErrors
]

export const updateInvoiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id", "No es un ID válido").isMongoId(),
    param("id").custom(InvoiceExists),
    validarCampos,
    handleErrors
]

export const getInvoiceOfUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
]





