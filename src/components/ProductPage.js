import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import parseHtmlString from 'html-react-parser';

import client from '../AppClient';
import getAmount from '../getAmount';
import addParams from '../helpers/addParams';
import { getProductDetails } from '../queries/queries.js';
import { addProductToCart } from '../redux/cartSlice';
import Attributes from './Attributes';

import '../styles/productpage.css';

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            brand: '',
            attributes: [],
            selectedAttributes: [],
            price: 0,
            prices: [],
            inStock: false,
            gallery: [],
            description: ''
        };
    }

    async componentDidMount() {
        await this.fetchProducts();
    }

    fetchProducts = async () => {
        const response = await client.query({
            query: getProductDetails,
            variables: { productId: this.props.params.productId }
        });

        const { data: { product } } = response;
        const { name, attributes, brand, gallery, description, prices, inStock } = product;
        const selectedAttributes = attributes.map(({ id, name, items }) => {
            return {
                id,
                name,
                selectedAttribute: items[0]?.id
            };
        });

        const price = getAmount(prices, this.props.currency);
   
        this.setState(() => ({
            brand,
            name,
            attributes,
            selectedAttributes, 
            gallery,
            selectedImage: gallery[0],
            description,
            prices,
            price,
            inStock
        }));
    };

    selectAttribute = (attributeId, selectedAttr) => {
        const selectedAttributes = [...this.state.selectedAttributes];

        const attributeIndex = selectedAttributes.findIndex(
            (attribute) => attribute.id === attributeId
        );

        selectedAttributes[attributeIndex].selectedAttribute = selectedAttr;

        this.setState(() => ({
            selectedAttributes
        }));
    };

    selectImage = (imageIndex) => {
        this.setState((state) => ({
            selectedImage: state.gallery[imageIndex]
        }));
    };

    addToCartHelper = () => {
        const {
            brand,
            name,
            attributes,
            selectedAttributes,
            gallery,
            description,
            prices
        } = this.state;
        this.props.addProductToCart({
            brand,
            name,
            attributes,
            selectedAttributes,
            gallery,
            description,
            prices
        });
    }

    render() {
        const {
            brand,
            name,
            attributes,
            selectedAttributes,
            gallery,
            selectedImage,
            description,
            prices,
            inStock
        } = this.state;
        const { currency } = this.props;
        const price = (prices.length !== 0) ? getAmount(prices, currency) : 0;
        return (
            <div className='product-page'>
                <div className="product-gallery">
                    {gallery.map((image, index) => (
                        <div
                            key={index}
                            className="side-image"
                            onClick={() => this.selectImage(index)}
                        >
                            <img src={image} alt={image}></img>
                            <div className="img-bg"></div>
                        </div>
                    ))}
                </div>
                <div className="selected-image">
                    <img src={selectedImage} alt="selected-product"></img>
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
                <div className="product-details">
                    <h2 className="product-brand">{brand}</h2>
                    <h2 className='product-name'>{name}</h2>

                    {attributes.map((attribute, index) => {
                        const selectedAttribute = selectedAttributes.find(
                            (attr) => attribute.id === attr.id
                        )?.selectedAttribute;
                        return (
                            <Attributes
                                key={`${selectedAttribute}-${index}`}
                                attributes={attribute}
                                selectedAttribute={selectedAttribute}
                                selectAttribute={(type, attributeId) =>
                                    this.selectAttribute(type, attributeId)
                                }
                            />
                        );
                    })}

                    <h3 className="price">PRICE:</h3>
                    <h3 className="price-value">
                        {currency}
                        {price}
                    </h3>
                    <button
                        className='default-button green-button'
                        onClick={() => this.addToCartHelper()}
                        disabled={!inStock}
                    >
                        ADD TO CART
                    </button>
                    <div className="product-description">
                        {parseHtmlString(description)}
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ currency }) => ({ currency });
const mapDispatchToProps = { addProductToCart };
 
export default connect(mapStateToProps, mapDispatchToProps)(addParams(ProductPage));