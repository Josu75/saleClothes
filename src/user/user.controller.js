import { hash, verify } from "argon2";
import User from "./user.model.js"
import cloudinary from "../../configs/cloudinary.js";

const DEFAULT_IMAGES = [
  "Screenshot_2025-03-08_232955_isqjl8"
];

export const getUserById = async (req, res) => {
    try {
        const { _id } = req.usuario
        const user = await User.findById(_id)


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { beforePassword, newPassword, username } = req.body

        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findOne({ username: username }).select("_id role password");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        /*Miramos que el usuario que esta intentando editar sea ADMIN_ROLE y que si quiere editar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && existingUsername.role === "ADMIN_ROLE" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para ver este usuario"
            });
        }


        if (req.usuario.role === "CLIENT_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro usuario que no sea el tuyo."
            });
        }

        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && existingUsername.role === "ADMIN_ROLE" && 
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro admin"
            });
        }

        if (!beforePassword) {
            return res.status(404).json({
                success: false,
                message: "debes de colocar la password anterior."
            });

        }

        //Verificar la password anterior colocada en el body, con la password de la db.
        const VerifybeforePassword = await verify(existingUsername.password, beforePassword);
        if (!VerifybeforePassword) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }


        const matchOldAndNewPassword = await verify(existingUsername.password, newPassword)

        if (matchOldAndNewPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(existingUsername._id, { password: encryptedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { beforeUsername } = req.body
        const userToUpdate = await User.findById(_id)

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const existingUsername = await User.findOne({ username: beforeUsername }).select("_id role");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "CLIENT_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar datos de otro usuario que no sea el tuyo."
            });
        }

        const data = req.body;

        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && existingUsername.role === "ADMIN_ROLE" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar a otro admin."
            });
        }

        /*Aqui valido de que si el usuario se pone como admin o otro rol distinto a user_role
        no le deje cambiarselo, unicamente user.*/
        if (req.usuario.role !== "ADMIN_ROLE" && data.role && data.role !== "CLIENT_ROLE") {
            return res.status(400).json({
                message: "Tu solamente te puedes ser: CLIENT_ROLE"
            });
        }

        const user = await User.findByIdAndUpdate(existingUsername._id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const updateProfilePicture = async (req, res) => {
  try {
    const usuario = req.usuario;
    const newUrl = req.file?.path;

    if (!newUrl) {
      return res.status(400).json({ success: false, message: 'No hay archivo en la petición' });
    }

    const user = await User.findById(usuario._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const oldPublicId = user.profilePicture?.split('/').pop().split('.')[0];

    if (oldPublicId && !DEFAULT_IMAGES.includes(oldPublicId)) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    user.profilePicture = newUrl;
    await user.save();

    return res.status(200).json({ success: true, message: 'Foto actualizada', profilePicture: user.profilePicture });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al actualizar la foto', error: err.message });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const usuario = req.usuario;
    const user = await User.findById(usuario._id);
    if (!user) {
      return res.status(404).json({ success:false, message:"Usuario no encontrado" });
    }

    const oldPublicId = user.profilePicture
      ?.split("/")
      .pop() 
      .split(".")[0];

    if (oldPublicId && !DEFAULT_IMAGES.includes(oldPublicId)) {
      await cloudinary.uploader.destroy(oldPublicId);
    }
    const defaultUrl =
      "https://res.cloudinary.com/dfvdnu8xa/image/upload/v1750719617/Screenshot_2025-03-08_232955_isqjl8.png";

    user.profilePicture = defaultUrl;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Foto de perfil restablecida a la imagen por defecto",
        profilePicture: user.profilePicture 
      });
  } catch (err) {
    return res.status(500).json({ success:false, message:"Error al eliminar la foto", error: err.message });
  }
};

/*Funcion para crear usuario por default*/
export const createDefaultUser = async () => {
    try {
        /*Agregamos la constante de email por default antes 
        debido a que necesitamos este email para buscar si ya existe.
        */
        const defaultEmail = "admin@example.com";

        /*Aqui en este apartado buscamos si existe el usuario en la base de datos
        por medio de defaultEmail.
        */
        const existingUser = await User.findOne({ email: defaultEmail });
        //Si ya existe tira esta validacion y no hara nada.
        if (existingUser) {
            console.log("El usuario administrador ya existe. No se creará nuevamente.");
            return;
        }

        //Si no esta el usuario creado encriptara esta password con argon.
        const hashedPassword = await hash("Admin1234#/SFDS=)");

        /*Definimos los valores por default del usuario.*/
        const defaultUser = new User({
            name: "Admin",
            surname: "User",
            username: "admin",
            email: defaultEmail,
            password: hashedPassword,
            phone: "12345678",
            role: "ADMIN_ROLE",
            status: true,
        });

        //Lo guardamos en la base de datos.
        await defaultUser.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("Usuario administrador creado exitosamente.");
    } catch (error) {
        console.error("Error al crear el usuario administrador:", error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { Password, username } = req.body

        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findOne({ username: username }).select("_id role password");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar otro admin."
            });
        }


        if (req.usuario.role === "USER_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar a otro usuario que no sea el tuyo."
            });
        }


        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar a otro admin"
            });
        }

        if (!Password) {
            return res.status(404).json({
                success: false,
                message: "debes de colocar la password del usuario."
            });

        }

        //Verificar la password anterior colocada en el body, con la password de la db.
        const VerifybeforePassword = await verify(existingUsername.password, Password);
        if (!VerifybeforePassword) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }

        await User.findByIdAndUpdate(existingUsername._id, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            existingUsername
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}

export const updateOtherUser = async (req, res) => {
    try {
        const { uid } = req.params
        const { token } = req.usuario
        const userToUpdate = await User.findById(uid)
        const data = req.body;

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const existingUsername = await User.findById(uid).select("_id role");

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar a otro admin."
            });
        }

        const user = await User.findByIdAndUpdate(userToUpdate._id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const deleteOtherUser = async (req, res) => {
    try {
        const { token } = req.usuario
        const { uid } = req.params

        const user = await User.findById(uid)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findById(uid).select("_id role");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar otro admin."
            });
        }

        await User.findByIdAndUpdate(existingUsername._id, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            existingUsername
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}





