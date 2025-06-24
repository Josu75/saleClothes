import User from "../user/user.model.js"
import Category from "../category/category.model.js"
import Product from "../product/product.model.js"
import Cart from "../cart/cart.model.js"

export const emailExists = async (email = "") => {
    const existe = await User.findOne({ email })
    if (existe) {
        throw new Error(`The email ${email} is already registered`)
    }
}

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({ username })
    if (existe) {
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if (!existe) {
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const categoryExists = async (id = " ") => {
    const existe = await Category.findById(id)
    if (!existe) {
        throw new Error("No existe la categoria con el ID proporcionado")
    }
}

export const nameCategoryExists = async (name = " ") => {
    const existe = await Category.findOne({ name })
    if (existe) {
        throw new Error(`The category ${name} is already registered`)
    }
}

export const productExists = async (id = " ") => {
    const existe = await Product.findById(id)
    if (!existe) {
        throw new Error("No existe la Producto con el ID proporcionado")
    }
}

export const nameProductExists = async (name = " ") => {
    const existe = await Product.findOne({ name })
    if (existe) {
        throw new Error(`The Product ${name} is already registered`)
    }
}

export const cartExists = async (id = " ") => {
    const existe = await Cart.findById(id)
    if (!existe) {
        throw new Error("No existe la Carta con el ID proporcionado")
    }
}

export const nameCartExists = async (name = " ") => {
    const existe = await Cart.findOne({ name })
    if (existe) {
        throw new Error(`The Carta ${name} is already registered`)
    }
}






