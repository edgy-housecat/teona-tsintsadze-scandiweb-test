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
            description: '',
            allAttrChecked: false
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
        let selectedAttributes = attributes.map(({ id, name, items }) => {
            return {
                id,
                name,
                selectedAttribute: ''
            };
        });

        const allAttrChecked = selectedAttributes.length === 0 ? true : false;

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
            inStock,
            allAttrChecked
        }));
    };

    selectAttribute = (attributeId, selectedAttr) => {
        let selectedAttributes = [...this.state.selectedAttributes];

        const attributeIndex = selectedAttributes.findIndex(
            (attribute) => attribute.id === attributeId
        );
        
        selectedAttributes[attributeIndex] = {
            ...this.state.selectedAttributes[attributeIndex],
            selectedAttribute: selectedAttr
        }
        
        const allAttrChecked = selectedAttributes.every(attr => attr.selectedAttribute !== '')

        this.setState((state) => ({
            ...state,
            selectedAttributes,
            allAttrChecked
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
            gallery,
            selectedImage,
            description,
            prices,
            inStock,
            allAttrChecked
        } = this.state;
        let { selectedAttributes } = this.state;
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
                        let selectedAttribute = selectedAttributes.find(
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
                        disabled={!inStock || !allAttrChecked}
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