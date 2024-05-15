import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Set up Apollo client
const client = new ApolloClient({
    uri: 'https://2585-136-226-79-97.ngrok-free.app',
});

// Define your GraphQL query
const MY_QUERY = gql`
    {
        organization(id:"LightStep") {
            project(id:"dev-jhyland") {
                alerts {
                    name
                    associatedCIs {
                        ciIdentifier {
                            sysId
                            className
                        }
                        name
                        assetTag
                        assetLink
                    }
                }
            }
        }
    }
`;

// Create a component that fetches and displays data
function MyComponent() {
    const { loading, error, data } = useQuery(MY_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // Replace 'data.items' with the actual path to the items in your query result
    return (
        <table>
            {data.items.map(item => (
                <tr>
                    {/* Replace 'item.field' with the actual fields you want to display */}
                    <td>{item.field1}</td>
                    <td>{item.field2}</td>
                    <td>{item.field3}</td>
                </tr>
            ))}
        </table>
    );
}

// Wrap your application in ApolloProvider
function App() {
    return (
        <ApolloProvider client={client}>
            <MyComponent />
        </ApolloProvider>
    );
}

export default App;