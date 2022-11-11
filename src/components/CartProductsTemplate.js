import React from "react";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';

//icons
import plusIcon from '../icons/cart-plus.svg';
import minusIcon from '../icons/cart-minus.svg';
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';

import getAmount from '../getAmount';

import Attributes from './Attributes';

import { updateProduct, removeProduct } from '../redux/cartSlice';

class CartProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedImage: 0
        }
    }

    updateProductQuantity = (cartIndex, action) => {
        const product = cloneDeep(this.props.cart[cartIndex]);
        product.quantity += action === 'add' ? 1 : -1;
        if (product.quantity < 1) {
           this.props.removeProduct({ cartIndex });
        } else {
           this.props.updateProduct({ cartIndex, update: product });
        }
    };

    moveImage = (toTheRight) => {
        let index;
        const { selectedImage } = this.state;
        if (toTheRight) {
            index = selectedImage < this.props.gallery.length - 1 ? selectedImage + 1 : 0;
        } else {
            index = selectedImage === 0 ? this.props.gallery.length - 1 : selectedImage - 1;
        }

        this.setState(() => ({
            selectedImage: index
        }));
    };

    render() {
        const { product, index, currency, isCartTab, gallery } = this.props; 
        const { selectedImage } = this.state;
        
        return (
            <>
                <div className='flex-wrapper'>
                    <div className='item-details'>
                        <h2 className="item-brand">{product.productDetails.brand}</h2>
                        <h2 className="item-name">{product.productDetails.name}</h2>
                        <h3 className="item-amount">
                            {currency}
                            {Number.parseFloat(getAmount(product.productDetails.prices, currency)).toFixed(2)}
                        </h3>
                        {product.productDetails.attributes.map((attribute, index) => {
                            const selectedAttribute = product.productDetails.selectedAttributes.find(
                                (attr) => attribute.id === attr.id
                            )?.selectedAttribute;
                            return (
                                <div className="cart-attributes">
                                    <Attributes
                                        key={`${selectedAttribute}-${index}`}
                                        attributes={attribute}
                                        selectedAttribute={selectedAttribute}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="right-items">
                        <div className="product-quantity">
                            <img
                                onClick={() =>
                                    this.updateProductQuantity(index, 'add')
                                }
                                src={plusIcon}
                                alt="increase-quantity"
                            />
                            <h4 className="quantity">{product.quantity}</h4>
                            <img
                                onClick={() =>
                                    this.updateProductQuantity(index, 'subtract')
                                }
                                src={minusIcon}
                                alt="reduce-quantity"
                            />
                        </div>
                        <div className='cart-item-image'>
                            <img src={gallery[selectedImage]} alt="cart-item-pic" />
                            {!isCartTab && gallery.length > 1 && (
                                <div className="arrow-group">
                                    <img
                                        className="arrow-left"
                                        src={arrowLeft}
                                        alt="arrow left"
                                        onClick={() => this.moveImage(false)}
                                    />
                                    <img
                                        className="arrow-right"
                                        src={arrowRight}
                                        alt="arrow right"
                                        onClick={() => this.moveImage(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ cart }) => ({ cart });
const mapDispatchToProps = { updateProduct, removeProduct };

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts); 