import { version } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "sales Systems API",
            version:"1.0.0",
            description: "API para gestion de ventas.",
            contact:{
                name: "Josue Garcia",
                email: "jgarcia-2023324@kinal.org.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3001/salesManager/v1"
            }
        ]
    },
    apis:[
        "./src/auth/*.js",
        "./src/user/*.js",
        "./src/category/*.js",
        "./src/product/*.js",
        "./src/cart/*.js",
        "./src/invoice/*.js"
    ]
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
export { swaggerDocs, swaggerUi }