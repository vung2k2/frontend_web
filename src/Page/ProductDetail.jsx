import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ShopContext } from '../context/ShopContext';
import './CSS/ProductDetail.css';
import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import CompareList from '../Components/CompareList/CompareList';
import Footer from '../Components/Footer/Footer';

const ProductDetail = () => {
    const { slug } = useParams();
    const allProducts = useProducts();
    const product = allProducts.find((product) => product.slug === slug);
    const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(false);

    useEffect(() => {
        document.body.style.overflow = showPurchaseConfirmation ? 'hidden' : 'unset';
        // Thiết lập lại trạng thái ngăn cuộn khi component bị hủy
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showPurchaseConfirmation]);

    // Xử lý khi click so sánh
    const { addToCompareList, removeFromCompareList, compareList, setViewedProducts } = useContext(ShopContext);
    const [isCompared, setIsCompared] = useState(() => {
        if (product) {
            return compareList.some((item) => item.id === product.id);
        }
        return false;
    });
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

    const addProductIdToLocalStorage = (productId) => {
        let productIds = JSON.parse(localStorage.getItem('viewedHistory')) || [];
        // Kiểm tra nếu id đã tồn tại, loại bỏ id đó
        productIds = productIds.filter((id) => id !== productId);
        // Thêm id mới vào mảng
        productIds.unshift(productId);
        // Kiểm tra nếu số lượng id vượt quá 10, loại bỏ id cũ nhất
        if (productIds.length > 10) {
            productIds = productIds.slice(0, 10);
        }

        // Lưu danh sách mới vào Local Storage
        localStorage.setItem('viewedHistory', JSON.stringify(productIds));
        setViewedProducts(productIds);
    };

    useEffect(() => {
        if (product && product.id) {
            addProductIdToLocalStorage(product.id);
        }
    }, [product]);

    const toggleCompare = () => {
        setIsCompared(!isCompared);
    };

    // Viết hoa tên hãng
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (!product) {
        return <div></div>;
    }

    const videoId = product.videoUrl.split('/').pop();

    const slideImages = [`https://www.youtube.com/embed/${videoId}`, `${product.imageUrl}`];

    const properties = {
        autoplay: false,
        infinite: true,
        indicators: true,
        arrows: true,
    };

    const handleBuyNow = () => {
        setShowPurchaseConfirmation(true);
        // Xử lý logic mua hàng tại đây
    };

    // Cuộn trang lên đầu
    window.scroll(0, 0);

    return (
        <div>
            <Breadcrum product={product} />
            <div className="product-detail">
                <div className="product-detail-header">
                    <h2>Điện thoại {product.name}</h2>
                    <div className="rating">
                        <span className="number-stars">{product.numberReview}</span>
                        <span className="stars"> ★★★★★</span>
                        <span className="rating-count">({product.rate})</span>
                    </div>
                    <span className="product-card-compare" onClick={handleAddToCompare}>
                        {isCompared ? '✓ Đã thêm vào so sánh' : '+ So sánh'}
                    </span>
                </div>

                <div className="box-main">
                    <div className="box-left">
                        <div className="slide-show">
                            <Slide {...properties}>
                                {slideImages.map((slide, index) => (
                                    <div key={index} className="each-slide">
                                        {slide.includes('youtube.com') ? (
                                            <iframe
                                                title={`Slide ${index + 1}`}
                                                width="560"
                                                height="315"
                                                src={`${slide}?rel=0`}
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <img
                                                style={{
                                                    pointerEvents: 'none',
                                                }}
                                                src={slide}
                                                alt={`Slide ${index + 1}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </Slide>
                        </div>
                        <div className="purchase">
                            <span
                                style={{
                                    fontSize: '20px',
                                    fontStyle: 'italic',
                                    fontWeight: '600',
                                    textDecoration: 'underline',
                                }}
                            >
                                Giá ưu đãi:
                            </span>
                            <div className="product-price">
                                <span className="product-new-price">
                                    {product.newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                                </span>
                                <span className="product-old-price">
                                    {product.oldPrice.toString().length >= 8
                                        ? product.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                        : product.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'}
                                </span>
                                <span className="product-discount">
                                    Giảm {Math.floor((1 - product.newPrice / product.oldPrice) * 100)}%
                                </span>
                            </div>

                            <button className="btn-buy" onClick={handleBuyNow}>
                                <p
                                    style={{
                                        marginTop: '15px',
                                        fontSize: '22px',
                                        fontWeight: '700',
                                        lineHeight: '0',
                                    }}
                                >
                                    Mua ngay
                                </p>
                                <p style={{ fontStyle: 'italic' }}>(Miễn phí giao hàng trên toàn quốc)</p>
                            </button>
                        </div>
                    </div>
                    <div className="box-right">
                        <div className="product-parameters">
                            <span>Cấu hình Điện thoại {product.name}</span>
                            <ul>
                                <li>
                                    <p className="parameter-name">Màn hình:</p>
                                    <p className="parameter-value">{product.screen}</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Camera sau:</p>
                                    <p className="parameter-value">{product.behindCam}</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Camera trước:</p>
                                    <p className="parameter-value">{product.selfieCam}</p>
                                </li>
                                <li>
                                    <p className="parameter-name">CPU:</p>
                                    <p className="parameter-value">{product.chip}</p>
                                </li>
                                <li>
                                    <p className="parameter-name">RAM:</p>
                                    <p className="parameter-value">{product.ram} GB</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Dung lượng lưu trữ:</p>
                                    <p className="parameter-value">{product.rom} GB</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Pin</p>
                                    <p className="parameter-value">{product.pin} mAh</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Tốc độ sạc</p>
                                    <p className="parameter-value">{product.chargeSpeed} W</p>
                                </li>
                                <li>
                                    <p className="parameter-name">Hãng</p>
                                    <p className="parameter-value">{capitalizeFirstLetter(product.category)}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {showPurchaseConfirmation && (
                <>
                    <div className="backdrop"></div>
                    <div className="purchase-confirmation">
                        <AiOutlineCloseCircle
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPurchaseConfirmation(false)}
                            className="close-popup"
                            size={30}
                            color="#808080"
                        />
                        <div className="product-info">
                            <img src={product.imageUrl} className="product-img" alt="" />
                            <div className="product-name-price">
                                <div className="name">{product.name}</div>
                                <div className="price">
                                    <div className="new-price">
                                        {product.newPrice.toString().length >= 8
                                            ? product.newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                            : product.newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'}
                                    </div>
                                    <div className="old-price">
                                        {product.oldPrice.toString().length >= 8
                                            ? product.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                            : product.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="select-quantity">
                            <p>Chọn số lượng:</p>
                            <input type="number" defaultValue="1" min={1} max={product.quantity} />
                            <span> {product.quantity} sản phẩm có sẵn</span>
                        </div>
                        <div className="add-cart">
                            <button>Thêm vào giỏ hàng</button>
                        </div>
                        <div style={{ width: '100%', paddingTop: '5px', justifyContent: 'center', display: 'flex' }}>
                            <Link style={{ textDecoration: 'none', color: 'blue', textAlign: 'center' }} to="/cart">
                                Xem giỏ hàng
                            </Link>
                        </div>
                    </div>
                </>
            )}
            <CompareList />
            <Footer />
        </div>
    );
};
export default ProductDetail;
