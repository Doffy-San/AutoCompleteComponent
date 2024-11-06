import React from "react";

const ProductTemplate = ({ item }) => (
  <div className="product-template">
    <img src={item.imageUrl} alt={item.name} className="product-image" />
    <span>{item.name}</span>
  </div>
);

export default ProductTemplate;
