import './App.css';
import {client} from "ApolloClient/client";
import {ApolloProvider} from '@apollo/client';
import EBookReader from "views/ebook_reader";

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <h2>
                        Ello - Full Stack Engineer Coding Challenge
                    </h2>
                    <EBookReader/>
                </header>
            </div>
        </ApolloProvider>
    );
}

export default App;
