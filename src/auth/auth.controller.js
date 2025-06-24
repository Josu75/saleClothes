import { hash, verify } from "argon2"
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js";
// import cloudinary from "../../configs/cloudinary.js"

export const register = async (req, res) => {
    try {
        const data = req.body;

        
        const defaultProfilePicture = "https://res.cloudinary.com/dfvdnu8xa/image/upload/v1750719617/Screenshot_2025-03-08_232955_isqjl8.png";

        let profilePictureUrl = defaultProfilePicture;

        // Si el usuario subió una imagen, la subimos a Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "users",
                public_id: `profile_${Date.now()}`
            });
            profilePictureUrl = result.secure_url;
        }

        if (data.role && data.role !== "CLIENT_ROLE") {
            return res.status(400).json({
                message: "Tu solamente te puedes registrar como: CLIENT_ROLE"
            });
        }
        data.role = "CLIENT_ROLE";

        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;

        data.profilePicture = profilePictureUrl;

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error("Error al registrar:", err.message);
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
};


export const login = async (req, res) => {
    const { email, username, password } = req.body
    try{
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error:"No existe el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error: "Contraseña incorrecta"
            })
        }

        const token = await generateJWT(user.id)

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                profilePicture: user.profilePicture
            }
        })
    }catch(err){
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        })
    }
}