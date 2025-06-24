import { config } from "dotenv"
import { initServer } from "./configs/server.js"
import {createDefaultUser}  from "./src/user/user.controller.js";
import {createDefaultCategory} from "./src/category/category.controller.js"

config()
const startServer = async () => {
    try {
        await initServer();
        //Llamamos la funcion de crear un usuario.
        await createDefaultUser();
        await createDefaultCategory();
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();

