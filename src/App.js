import './App.css';
import {client} from "ApolloClient/client";
import {ApolloProvider} from '@apollo/client';
import BasePage from "views/base";

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <p>
                        Ello-test
                    </p>
                    <BasePage />
                </header>
            </div>
        </ApolloProvider>
    );
}

export default App;
