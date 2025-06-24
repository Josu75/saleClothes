import Categories from "./category.model.js"
import Product from "../product/product.model.js";

export const createCategories = async (req, res) => {
  try {

    const data = req.body;
    const user = req.usuario

    const categories = new Categories({
      ...data
    });

    if (user.role !== 'ADMIN_ROLE') {
      return res.status(403).json({ message: 'No tienes permiso para crear categorias' });
    }

    await categories.save();

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoria', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const query = { status: true };
    const categories = await Categories.find(query)

    return res.status(200).json({
      success: true,
      categories
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message
    })
  }
}


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const category = await Categories.findById(id)
    if (!category) {
      return res.status(404).json({
        success: false,
        msg: "Categoria no encontrada",
      });
    }

    const updatedCategory = await Categories.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
      success: true,
      msg: "Categoria actualizada correctamente",
      category: updatedCategory,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al actualizar la cita",
      error,
    });
  }
};



export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Categories.findById(id)

    //si la categoria esta vacia
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "categoria no encontrada"
      });
    }

    //validacion para ver si la categoria ya esta eliminada.
    if (category.status == "false") {
      return res.status(400).json({
        success: false,
        message: "La categoria ya ha sido eliminada previamente"

      });
    }

    //Defino en la constante defaultCategory la categoria que coincida con el nombre: CATEGORY_DEFAULT la cual es la category default.
    const defaultCategory = await Categories.findOne({ name: "CATEGORY_DEFAULT" });

    if (!defaultCategory) {
      return res.status(500).json({
        success: false,
        message: "No se encontró la categoría por defecto en la base de datos"
      });
    }

    /*Aqui buscamos en Product el id de la categoria que acabamos de eliminar y lo reemplazamos por el id de defaultCategory
      para que aparezca como la categoria default.*/
    await Product.updateMany(
      { category: id },
      { category: defaultCategory._id }
    );

    //despues de las validaciones hacemos que actualize el estado de la categoria.
    const updateCategory = await Categories.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
    return res.status(200).json({
      success: true,
      message: "Categoria eliminada.",
      category: updateCategory
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoria.",
      error: err.message
    })
  }
}

/*Funcion para crear categoria por default*/
export const createDefaultCategory = async () => {
  try {
    /*Agregamos la constante de name por default antes 
    debido a que necesitamos este name para buscar si ya existe.
    */
    const defaultName = "CATEGORY_DEFAULT";

    /*Aqui en este apartado buscamos si existe la categoria en la base de datos
    por medio de defaultEmail.
    */
    const existingCategory = await Categories.findOne({ name: defaultName });
    //Si ya existe tira esta validacion y no hara nada.
    if (existingCategory) {
      console.log("La categoria ya existe. No se creará nuevamente.");
      return;
    }

    /*Definimos los valores por default del usuario.*/
    const defaultCategory = new Categories({
      name: "CATEGORY_DEFAULT",
      description: "Esta es una categoria predeterminada.",
      status: true
    });


    //Lo guardamos en la base de datos.
    await defaultCategory.save();

    //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
    console.log("La Categoria default fue creada exitosamente.");
  } catch (error) {
    console.error("Error al crear la categoria default:", error.message);
  }
};