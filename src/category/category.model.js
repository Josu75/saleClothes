import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },

    description: {
        type: String,
        maxLength: [200, "Description cannot exceed 200 characters"],
    },

    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timestamps: true
    })


export default model("Category", categorySchema)