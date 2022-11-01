import { ApolloProvider } from '@apollo/client';
import React from 'react';
import './App.css';
import client from './AppClient';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { Products, Navbar, ProductPage, CartPage } from './components';
import { getCategoriesQuery, getCurrenciesQuery } from "./queries/queries.js";
import { setCurrency } from './redux/currencySlice';
import { connect } from 'react-redux';


class App extends React.Component {
  constructor() {
    super();
    const navItem = localStorage.getItem('selected-nav');
    const selectedNav = navItem ? Number.parseInt(navItem, 10) : 0;
    this.state = {
      categories: [],
      currencies: [],
      selectedNav
    };
  }

  async componentDidMount() {
    const categoriesResponse = await client.query({query: getCategoriesQuery});
    const { data: { categories } } = categoriesResponse;

    const currenciesResponse = await client.query({query: getCurrenciesQuery});
    const { data: { currencies } } = currenciesResponse;

    this.setState((state) => ({
      ...state,
      categories: categories.map(({ name }) => name),
      currencies: currencies
    }));

    const defaultCurrency = this.props.currency || currencies[0].symbol || '';
    this.props.setCurrency(defaultCurrency);
  }

  setNav = (navIndex) => {
    this.setState(() => ({
      selectedNav: navIndex
    }));
    localStorage.setItem('selected-nav', navIndex);
  };

  render() {
    if (!this.state.categories.length > 0) return <></>;
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <div className="header">
              <Navbar {...this.state} setNavIndex={this.setNav} />
            </div>
            <div className="main">
              <Outlet />
              <Routes>
                <Route index element={ <Products initialCategory={this.state.categories[this.state.selectedNav || 0]} /> } />
                <Route path={'/products/:category'} element={<Products />} />
                <Route path={'/product/:productId'} element={<ProductPage />} />
                <Route path={'/cart'} element={<CartPage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

const mapStateToProps = ({ currency }) => ({ currency });
const mapDispatchToProps = { setCurrency };

export default connect(mapStateToProps, mapDispatchToProps)(App);;