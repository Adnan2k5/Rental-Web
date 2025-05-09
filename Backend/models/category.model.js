import mongoose from "mongoose";
import translateText from "../middlewares/translate.middleware.js";


const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    name_it: { type: String },
    subCategories: [
        {
            type: String,
        }
    ],
    subCategories_it: [
        {
            type: String,
        }
    ]
});

categorySchema.pre("save", async function (next) {
    if (!this.name_it) {
        this.name_it = await translateText(this.name);
    }

    if (!this.subCategories_it || this.subCategories_it.length !== this.subCategories.length) {
        this.subCategories_it = await Promise.all(this.subCategories.map((subCategory) => translateText(subCategory)));
    }

    next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;