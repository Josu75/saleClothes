import { Schema, model } from "mongoose";

const productSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [100, "Name cannot exceed 100 characters"]
    },
    stock: {
        type: Number,
        required: true,
        default: 50
    },
    text: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        default: true
    },

    price: {
        type: Number,
        required: true,
    },

    soldQuantity: {
        type: Number,
        default: 0
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

},
    {
        versionKey: false,
        timeStamps: true
    })


export default model("Product", productSchema)