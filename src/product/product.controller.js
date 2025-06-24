import Category from "../category/category.model.js";
import Product from "./product.model.js";


export const createProduct = async (req, res) => {
    try {
        //desestructuro los objetos del req.body de producto.
        const { name, stock, text, price, category } = req.body;
        const user = req.usuario

        // validacion para confirmar que el rol del usuario para crear productos sea unicamente el admin.
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ message: 'Los productos los pueden crear unicamente los admin' });
        }

        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db" });
        }

        const product = new Product({
            name,
            stock,
            text,
            price,
            category: existingCategory._id
        });

        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto.', error: error.message });
    }
};


export const getProduct = async (req, res) => {
    try {

        const query = { status: true };
        const product = await Product.find(query)
            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de producto
            .populate("category", "name description")

        return res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos",
            error: err.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de producto
            .populate("category", "name description")

        //Envio un 200 para dar un ok.
        return res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: err.message
        })
    }
}

export const getProductOutStock = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 })

            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de producto
            .populate("category", "name description")

        //Si todo funciona enviamos un 200 o ok.
        return res.status(200).json({
            success: true,
            products
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos agotados.",
            error: err.message
        })
    }
}


export const getProductMoreSeller = async (req, res) => {
    try {
        const products = await Product.find()
            //La funcion sort re ordena los productos en orden de los que tienen un numero mayor en soldQuantity.
            .sort({ soldQuantity: -1 })
            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de producto.
            .populate("category", "name description")

        //Si todo funciona enviamos un 200 o ok.
        return res.status(200).json({
            success: true,
            products
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos mas vendidos.",
            error: err.message
        })
    }
}


export const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const { category, ...data } = req.body;

        //Buscamos un producto por medio del id del params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrada",
            });
        }

        //Busco la categoria por nombre y la guardo en "existingCategory" para poder actualizarla
        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db, es necesario colocar la categoria" });
        }

        //Actualizo los parametros dentro de la base de datos. 
        data.category = existingCategory._id;
        

        //Actualizo el producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(id, data, {new: true})

        res.status(200).json({
            success: true,
            msg: 'Producto Actualizado',
            updatedProduct,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el producto",
            error,
        });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)

        //validamos que el producto no venga vacio.
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        //Validamos para ver si el producto ya esta eliminado.
        if (product.status == "false") {
            return res.status(400).json({
                success: false,
                message: "El producto ya ha sido eliminada previamente."
            })
        }

        const updateProduct = await Product.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        )
        return res.status(200).json({
            success: true,
            message: "Producto eliminado.",
            product: updateProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar le producto",
            error,
        });
    }
}


export const getProductByName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "El nombre del producto es necesario"
            });
        }
        const product = await Product.findOne({ name })

            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de Producto
            .populate("category", "name description")

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: err.message
        })
    }
}

export const getProductByCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: "La categoria es necesaria para buscar."
            });
        }

        //Busco categoria por su nombre el cual recibimos en el body.
        const category = await Category.findOne({ name: categoryName })
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }
        //Busco la categoria de producto por medio del id de category que recibi antes.
        const products = await Product.find({ category: category._id })
            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de Producto
            .populate("category", "name description")

            //Si productos no tiene nada mando una validacion para que no aparezca el array vacio si no mejor tire este mensaje
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No hay productos en esta categoría"
            });
        }

        return res.status(200).json({
            success: true,
            products
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: err.message
        })
    }
}

































