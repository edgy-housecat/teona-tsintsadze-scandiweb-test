import React from 'react';
import Product from './ProductCard';
import client from '../AppClient';
import { connect } from 'react-redux';

import { getProductsQuery } from '../queries/queries';

//styles
import "../styles/product.css";

//helper functions
import addParams from '../helpers/addParams';
import getAmount from '../getAmount';

class Products extends React.Component {
    constructor(props) {
        super(props);
        const { params, initialCategory } = props;
        this.state = {
            products: [],
            selectedCategory: params.category || initialCategory
        };
    }

    async componentDidMount() {
        const selectedCategory = this.state.selectedCategory;
        if (selectedCategory) await this.fetchProducts(getProductsQuery, selectedCategory);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.params.category !== this.props.params.category) {
            this.fetchProducts(getProductsQuery, this.props.params.category);
        }
    }

    fetchProducts = async(getProductsQuery, selectedCategory) => {
        const response = await client.query({
            query: getProductsQuery,
            variables: { categoryType: selectedCategory }
        });
        const { data: { category: { products } } } = response;

        this.setState((state) => ({
            ...state,
            products,
            selectedCategory: selectedCategory
        }));
    }

    navigateToProductPage = (productID) => {
        this.props.navigate(`/product/${productID}`);
    };

    render() {
        const { products, selectedCategory } = this.state;
        const { currency } = this.props;

        return (
            <div className="products-page">
                <h2>
                {selectedCategory[0].toUpperCase() +
                    selectedCategory.slice(1).toLowerCase()}
                </h2>
                <div className="product-grid">
                    {products.map(product => {
                        return (
                            <Product 
                                key={product.id}
                                product={product}
                                currency={currency}
                                productID={product.id}
                                price={getAmount(product.prices, currency)}
                                goToProduct={() => this.navigateToProductPage(product.id)}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ currency }) => ({ currency });

export default connect(mapStateToProps)(addParams(Products));