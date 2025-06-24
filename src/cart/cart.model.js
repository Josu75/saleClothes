import { Schema, model } from "mongoose";

const cartSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [100, "Name cannot exceed 25 characters"]
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],

    status: {
        type: Boolean,
        default: true
    },

},
    {
        versionKey: false,
        timeStamps: true
    })


export default model("Cart", cartSchema)