import { Component } from 'react';
import { connect } from 'react-redux';
import getCartDetails from '../getCart';
import CartProducts from './CartProductsTemplate';
import { resetCart } from '../redux/cartSlice';

import "../styles/cartPage.css";

class CartPage extends Component {
      // checkoutCart = async () => {
      //    this.props.resetCart();
      // };

      render() {
         const { cart, currency, resetCart } = this.props;
         const cartPageItems = cart.map((product, index) => (
            <div key={`${index}-${product.name}`}>
                  <hr></hr>
                  <CartProducts
                     product={product}
                     index={index}
                     currency={currency}
                     key={`${product.productDetails.name}-${product.quantity}-${index}`}
                     isCartTab={false}
                     gallery={product.productDetails.gallery}
                  />
                  {index === cart.length - 1 && <hr></hr>}
            </div>
         ));

         const { totalItems, tax, taxPercentage, totalCost } = getCartDetails(cart, currency);

         return (
            <div className="cart-page">
               <h3 className="cart-page-title">CART</h3>
               {cartPageItems}

               {totalItems < 1 && <h3>Your cart is empty</h3>}
               {totalItems > 0 && (
                  <>
                     <div className="checkout-details">
                        <div className="left-column">
                           <p>Tax {taxPercentage}%:</p>
                           <p>Quantity:</p>
                           <p className='total-checkout-price'>Total:</p>
                        </div>
                        <div className="right-column">
                           <p>{currency}{tax}</p>
                           <p>{totalItems}</p>
                           <p>{currency}{totalCost}</p>
                        </div>
                     </div>
                     <div className="cart-btn-check-out cart-page-checkout">
                        <button
                           className="default-button green-button"
                           onClick={() => {resetCart()}}
                        >Order</button>
                     </div>
                  </>
               )}

            </div>
         );
   }
}
const mapStateToProps = ({ cart, currency }) => ({ cart, currency });
const mapDispatchToProps = { resetCart };

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
