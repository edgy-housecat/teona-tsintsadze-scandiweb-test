import { Component, createRef } from "react";
import "../styles/navbar.css";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";

//icons
import mainLogo from "../icons/main-logo.svg"
import arrowDown from "../icons/arrow-down.svg";
import arrowUp from "../icons/arrow-up.svg";
import emptyCart from '../icons/empty-cart.svg';

import "../styles/navbar.css";

import getCartDetails from "../getCart";
import { setCurrency } from "../redux/currencySlice";
import { resetCart } from "../redux/cartSlice";

import CartTabItems from "./CartTabItems";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCurrencyTab: false,
            showCart: false,
            currencyDropdownRef: createRef(),
            cartDropdownRef: createRef()
        };
    }

    selectCurrency = (selectedCurrency) => {
        this.props.setCurrency(selectedCurrency);
        this.setState((state) => ({
            showCurrencyTab: false
        }));
    };

    listenToOutsideClick = (val, ref) => {
        const handleOutsideClick = (event) => {
            if (!ref?.current?.contains(event.target)) {
                this.setState(() => ({
                    [val]: false
                }));
                document.removeEventListener('mousedown', handleOutsideClick);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
    };

    render() {
        const { 
            categories, 
            setNavIndex, 
            selectedNav,
            currencies,
            currency: selectedCurrency,
            cart,
            resetCart
        } = this.props;

        const {
            showCurrencyTab,
            currencyDropdownRef,
            showCart,
            cartDropdownRef
        } = this.state;

        const { totalItems, totalCost } = getCartDetails(cart, selectedCurrency);

        const arrowDownIcon = (
            <img className="arrow-icon" src={arrowDown} alt="arrow down icon" />
        );
        const arrowUpIcon = (
            <img className="arrow-icon" src={arrowUp} alt="arrow up icon" />
        );

        const NavBarLinks = categories.map((item, index) => (
                <div className="category-link" key={index}>
                    <NavLink
                        onClick={() => setNavIndex(index)}
                        to={`/products/${item}`}
                        className={({isActive}) => `category-text 
                            ${isActive || (index != null && index === selectedNav) ? 'nav-selected' : '' }`
                        }>
                            {item}
                    </NavLink>
                </div>
            )
        );

        const currencyList = (
            <ul>
                {currencies.map(({ symbol, label }, index) => (
                    <li
                        className="currency"
                        key={index}
                        onClick={() => this.selectCurrency(symbol)}
                    >
                        {`${symbol} ${label}`}
                    </li>
                ))}
            </ul>
        );

        const currencyDropDown = (
            <div ref={currencyDropdownRef} className="currency-container">
                <div
                    className="currency-button"
                    onClick={(e) => {
                        this.setState((state) => ({
                            showCurrencyTab: !state.showCurrencyTab,
                            showCart: false
                        }));
                        this.listenToOutsideClick(
                            'showCurrencyTab',
                            currencyDropdownRef
                        );
                    }}
                >
                    <h4 className="selected-currency">{selectedCurrency}</h4>
                    <div className="currency-icon">
                        {!showCurrencyTab && arrowDownIcon}
                        {showCurrencyTab && arrowUpIcon}
                    </div>
                </div>
   
                <div 
                    className={clsx({
                        'currency-list': true,
                        'hidden-dropdown': true,
                        'show': showCurrencyTab
                    })}
                >
                    {currencyList}
                </div>
            </div>
        );

        const cartDropDown = (
            <div ref={cartDropdownRef} className="cart-container">
                <div
                    className="cart-button"
                    onClick={() => {
                        this.setState((state) => ({
                            showCart: !state.showCart,
                            showCurrencyTab: false
                        }));
                        this.listenToOutsideClick('showCart', cartDropdownRef);
                    }}
                >
                
                    <img className="cart-icon" src={emptyCart} alt="empty cart icon" />
   
                    <div
                        className={clsx({
                            'cart-quantity': true,
                            'show': cart.length > 0
                        })}
                    >
                        {totalItems}
                    </div>
                </div>
   
                <div
                    className={clsx({
                        'cart-list': true,
                        'hidden-dropdown': true,
                        'show': showCart
                    })}
                >
                    <div className="cart-content">
                        {cart.length > 0 && (
                            <div className="cart-details">
                                <h4 className="title">My Bag, </h4>
                                <h4 className="total">{totalItems} items</h4>
                            </div>
                        )}
                        {cart.length > 0 && <CartTabItems />}
                        {cart.length === 0 && <p>You have an empty cart.</p>}
                    </div>
                    <div className="cart-total-cost">
                        <h4 className="title">Total</h4>
                        <h4 className="total">
                            {selectedCurrency}
                            {totalCost}
                        </h4>
                    </div>

                    <div className="cart-buttons">
                        <div className="cart-btn-view-bag">
                            <Link to={'/cart'}>
                                <button
                                    className="default-button"
                                    onClick={() => {
                                        this.setState((state) => ({
                                            showCart: !state.showCart,
                                            showCurrencyTab: false
                                        }));
                                    }}
                                >View bag</button>
                            </Link>
                        </div>
    
                        <div className="cart-btn-check-out">
                            <button
                                className="default-button green-button"
                                onClick={() => {resetCart()}}
                            >Check out</button>
                        </div>
                    </div>
               </div>
            </div>
        );
        return (
            <>
                <nav>
                    <div className="links">
                        {NavBarLinks}
                    </div>
                    <img className="main-logo" src={mainLogo} alt="logo icon" />
                    <div className="dropdowns">
                        {currencyDropDown}
                        {cartDropDown}
                    </div>
                </nav>
                <div
                    className={clsx({
                        'body-overlay': true,
                        'show': showCart
                    })}
                ></div>
            </>
        );
    }
}

const mapStateToProps = ({ currency, cart }) => ({ currency, cart });
const mapDispatchToProps = { setCurrency, resetCart };

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
