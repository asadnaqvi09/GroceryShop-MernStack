import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../cards/ProductCard";

function ProductList({ products = [], pageType }) {
  const gridType =
    pageType === "Catalogue"
      ? "grid grid-cols-1 md:grid-cols-4 gap-4"
      : "grid grid-cols-1 md:grid-cols-5 gap-2";
  return (
    <div className={gridType}>
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id || index}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ProductCard 
            product={product}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ProductList;