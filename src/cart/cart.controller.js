import Cart from "./cart.model.js";
import Product from "../product/product.model.js";


export const addToCart = async (req, res) => {
    try {
        const user = req.usuario;
        const { name, products } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre del carrito es obligatorio" });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Debes enviar al menos un producto" });
        }

        //Aqui busco por medio de el carrito al usuario por medio del id
        let cart = await Cart.findOne({ user: user._id });

        /*Si en esta validacion no tiene el carrito crea uno nuevo y lo asigna con el usuario, el nombre y el producto con array vacio.
        si ya existe solo cambia el nombre.
        */
        if (!cart) {

            cart = new Cart({ user: user._id, name, products: [] });
        } else {

            cart.name = name;
        }


        for (const item of products) {
            /*Aqui desestructuro item para obtener especificamente el product y la cantidad de 
            cada iteracion*/
            const { product, quantity } = item;


            const foundProduct = await Product.findOne({ name: product });
            if (!foundProduct) {
                return res.status(404).json({ message: `Producto con ID ${product} no encontrado` });
            }


            if (quantity > foundProduct.stock) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${foundProduct.name}` });
            }
            /*Con findIndex es un metodo que nos sirve para el array de productos si se encuentra un elemento que cumple
            con la condicion devolvera el indice en cambio si no la encuentra devuelve -1.
            */
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === foundProduct._id.toString());

            if (existingProductIndex !== -1) {
                /*Vamos a incrementar el array de productos si nos damos cuenta de que si existingProductIndex no es -1 lo que significa
                que ya estaba en el carrito de compras
                */
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                /*y si no esta entnces lo agregamos al carrito de compras en el array de productos con la cantidad puesta por el usuario
                y obviamente el id del producto.*/
                cart.products.push({ product: foundProduct._id, quantity });
            }
        }

        await cart.save();

        res.status(200).json({ success: true, message: "Productos agregados al carrito", cart });

    } catch (error) {
        res.status(500).json({ message: "Error al agregar productos al carrito", error: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const user = req.usuario;
        const { product, quantity } = req.body;

        if (!product) {
            return res.status(400).json({
                message: "El nombre del producto es obligatorio"
            });
        }

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Carrito no encontrado"
            });
        }

        const foundProduct = await Product.findOne({ name: product });

        if (!foundProduct) {
            return res.status(404).json({
                message: `Producto con nombre ${product} no encontrado`
            });
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === foundProduct._id.toString());

        if (existingProductIndex === -1) {
            return res.status(404).json({
                message: `Producto con nombre ${product} no está en el carrito`
            });
        }

        if (quantity && cart.products[existingProductIndex].quantity > quantity) {
            cart.products[existingProductIndex].quantity -= quantity;
        } else {

            cart.products.splice(existingProductIndex, 1);
        }

        await cart.save();

        res.status(200).json({ success: true, message: "Producto eliminado del carrito de compras", cart });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
};


export const getCartById = async (req, res) => {
    try {
        const { _id } = req.usuario;  
    
        const cart = await Cart.findOne({ user: _id }).populate("products.product");  

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el carrito",
            error: err.message
        });
    }
};






























