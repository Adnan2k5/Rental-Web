// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Button } from './button';
import { toast } from 'sonner';
import { addItemToCartApi } from '../../api/carts.api';

export const ProductCard = ({index, fadeIn, product, onQuickView}) => {

    const addItemToCart = async (e) => {
        try {
            e.preventDefault();
            e.stopPropagation();
            await addItemToCartApi(product._id, 1, 1);
            toast.success("Item added to cart successfully");
        }
        catch(e) {
            toast.error("Failed to add item to cart");
        }
    }


    return <motion.div
        key={index}
        variants={fadeIn}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group"
    >
        <div className="relative">
            <img
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {/* {product.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant={tag === "New" ? "default" : "secondary"} className="text-xs">
                            {tag}
                          </Badge>
                        ))} */}
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onQuickView();
                    }}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition"
                >
                    Quick View
                </Button>
            </div>
        </div>
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                    {product.category}
                </span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1 truncate">
                {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
                by {product.brand}
            </p>
            <div className="flex items-center justify-between">
                <p className="font-bold text-primary">
                    ${product.price}/mo
                </p>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={addItemToCart}
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    </motion.div>
}