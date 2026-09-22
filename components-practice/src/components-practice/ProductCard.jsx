function ProductCard({ name, price, category, image }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>Price: {price}</p>
      <p>Category: {category}</p>
      <button>Buy Now</button>
    </div>
  );
}

export default ProductCard;