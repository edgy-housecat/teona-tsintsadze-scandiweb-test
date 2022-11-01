import { Component } from 'react';
import { connect } from 'react-redux';

import CartProducts from './CartProductsTemplate'

//services
import { updateProduct, removeProduct } from '../redux/cartSlice';

import "../styles/cartItems.css";

class CartItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImage: props.product?.productDetails?.gallery[0]
        };
    }

    render() {
        const {
            currency,
            cart
        } = this.props;

        const cartTabItems = cart.map((product, index) => (
            <div key={`${product.productDetails.name}-${index}`}>
                <CartProducts
                    key={`${product.productDetails.brand}-${product.quantity}-${index}`} 
                    product={product}
                    index={index}
                    currency={currency}
                    isCartTab={true}
                    gallery={product.productDetails.gallery}
                />
            </div>
        ));
        return (
            <div className="cart-items-container">
                {cartTabItems}
            </div>
        );
    }
}
const mapStateToProps = ({ currency, cart }) => ({ currency, cart });
const mapDispatchToProps = { updateProduct, removeProduct };

export default connect(mapStateToProps, mapDispatchToProps)(CartItems); 