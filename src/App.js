import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Set up Apollo client
const client = new ApolloClient({
    uri: 'http://localhost:8080/query',
    cache: new InMemoryCache(),
});

const MY_QUERY = gql`
    {
        organization(id:"LightStep") {
            project(id:"dev-jhyland") {
                alerts {
                    name
                    status
                    snoozed
                    destinations {
                        name
                        type
                        url
                        channel
                    }
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

    // Debugging output - delete me
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Data:', data);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // Check if data and data.organization.project.alerts are defined before trying to map over data.organization.project.alerts
    if (data && data.organization && data.organization.project && data.organization.project.alerts) {
        return (
            <div>
                <h1>Alert Triage for dev-jhyland</h1>
                <p>Hi! This is a React app. It isn't running in a ServiceNow instance, but it <i>could</i> be.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Snoozed</th>
                        <th>Associated CIs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.organization.project.alerts.map(alert => (
                        <tr key={alert.name}>
                            <td>{alert.name}</td>
                            <td>{alert.status}</td>
                            <td>{alert.snoozed ? "yes" : "no"}</td>
                            <td>
                                <ul>
                                    {alert.associatedCIs.map(ci => (
                                        <li key={ci.ciIdentifier.sysId}>
                                            <a href={ci.assetLink}>{ci.name} ({ci.assetTag})</a>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return <p>No data available</p>;
    }
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