import mongoose from "mongoose";
import translateText from "../middlewares/translate.middleware.js";


const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    name_li: { type: String },
    subCategories: [
        {
            type: String,
        }
    ],
    subCategories_li: [
        {
            type: String,
        }
    ]
});

categorySchema.pre("save", async function (next) {
    if (!this.name_li) {
        this.name_li = await translateText(this.name);
    }

    if (!this.subCategories_li || this.subCategories_li.length !== this.subCategories.length) {
        this.subCategories_li = await Promise.all(this.subCategories.map(translateText));
    }

    next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;