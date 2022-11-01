import React from 'react';
import clsx from "clsx";
import cartIcon from "../icons/green-cart.svg";
import client from '../AppClient';
import { getProductDetails } from '../queries/queries';
import { connect } from 'react-redux';
import { addProductToCart } from '../redux/cartSlice';


class Product extends React.Component {
    fetchProductDetailsAndAddToCart = async () => {
        const { data: { product } } = await client.query({
            query: getProductDetails,
            variables: { productId: this.props.productID }
        });

        const { name, attributes, brand, gallery, description, prices } = product;

        const selectedAttributes = attributes.map(({ id, name, items }) => {
            return {
                id,
                name,
                selectedAttribute: items[0]?.id
            };
        });
        this.props.addProductToCart({
            brand,
            name,
            attributes,
            selectedAttributes,
            gallery,
            description,
            prices
        });
    };
        
    addProductToCart = (e) => {
        e.stopPropagation();
        this.fetchProductDetailsAndAddToCart();
    };

    render() {
        const { name, gallery, inStock, brand } = this.props.product;
        const { goToProduct, price, currency } = this.props;
        
        return (
            <div 
                className="product"
                onClick={() => goToProduct()}
            >
                <div className="product-image">
                    <img alt={name} src={gallery[0]} />
                    {inStock && (
                        <img
                            className="green-cart-icon cursor-pointer"
                            src={cartIcon}
                            alt="Cart Icon"
                            onClick={(e) => this.addProductToCart(e)}
                        ></img>
                    )}
                    {!inStock && (
                        <h4 className="out-of-stock">OUT OF STOCK</h4>
                    )}
                    <div
                        className={clsx({
                            'img-bg': true,
                            "out-of-stock-bg": !inStock
                        })}
                    ></div>
                </div>
                <div className="product-description">
                    <p className="product-name">{`${brand} ${name}`}</p>
                    <p className="product-price">{currency}{price}</p>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { addProductToCart };

export default connect(null, mapDispatchToProps)(Product);