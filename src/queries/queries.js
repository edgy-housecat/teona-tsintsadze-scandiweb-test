import { gql } from "@apollo/client";

export const getCategoriesQuery = gql`
    {
        categories {
            name
        }
    }
`
export const getCurrenciesQuery = gql`
    {
        currencies {
            label
            symbol
        }
    }
`;

export const getProductsQuery = gql`
    query Category($categoryType: String!) {
        category(input: { title: $categoryType }) {
            name
            products {
                id
                name
                brand
                inStock
                gallery
                prices {
                    currency {
                    label
                    symbol
                    }
                    amount
                }
            }
        }
    }
`;

export const getProductDetails = gql`
    query Product($productId: String!) {
        product(id: $productId) {
            id
            name
            gallery
            description
            attributes {
                id
                name
                type
                items {
                    displayValue
                    value
                    id
                }
            }
            prices {
                currency {
                    label
                    symbol
                }
                amount
            }
            brand
            inStock
        }
    }
`;