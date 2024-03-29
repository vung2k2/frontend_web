import React, { useState, useContext } from 'react';
import './ProductItem.css'; // Import CSS file
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const ProductItem = ({ product }) => {
    const { imageUrl, name, oldPrice, newPrice, rate, numberReview } = product;

    const { addToCompareList, removeFromCompareList, compareList } = useContext(ShopContext);

    const [isCompared, setIsCompared] = useState(compareList.some((item) => item.id === product.id));

    const handleAddToCompare = () => {
        if (isCompared) {
            removeFromCompareList(product.id);
            setIsCompared(!isCompared);
        } else if (!isCompared && compareList.length < 3) {
            addToCompareList(product);
            setIsCompared(!isCompared);
        } else {
            alert('Danh sách so sánh đã đầy');
        }
    };

    const addToCart = () => {
        // Code xử lý thêm sản phẩm vào giỏ hàng
    };

    return (
        <li className="product-card">
            <Link style={{ textDecoration: 'none' }} to={`/product/${product.slug}`} className="product-link">
                <div className="product-card-image-wrapper">
                    <img className="product-card-image" src={imageUrl} alt={name} />
                </div>
            </Link>
            <div className="product-card-info">
                <Link style={{ textDecoration: 'none' }} to={`/product/${product.slug}`} className="product-link">
                    <div className="product-card-name">{name}</div>
                    <div className="product-card-prices">
                        <span className="product-card-new-price">
                            {newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                        </span>

                        <span className="product-card-old-price">
                            {oldPrice.toString().length >= 8
                                ? oldPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                      .substring(0, 6) + '...'
                                : oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'}
                        </span>

                        <span className="product-card-discount">-{Math.floor((1 - newPrice / oldPrice) * 100)}%</span>
                    </div>
                    <div className="product-card-rating">
                        <span className="product-card-rating-stars">★ {rate}</span>
                        <span className="product-card-rating-count">({numberReview})</span>
                    </div>
                </Link>
                <div>
                    <span className="product-card-compare" onClick={handleAddToCompare}>
                        {isCompared ? '✓ Đã thêm vào so sánh' : '+ So sánh'}
                    </span>
                </div>
                <div className="product-card-actions">
                    <button className="product-card-action-button" onClick={addToCart}>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </li>
    );
};

export default ProductItem;
