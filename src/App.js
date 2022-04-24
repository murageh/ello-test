import './App.css';
import {client} from "ApolloClient/client";
import {ApolloProvider} from '@apollo/client';
import EBookReader from "views/ebook_reader";

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <main className="App-content">
                    <h2>
                        Ello - Full Stack Engineer Coding Challenge
                    </h2>
                    <EBookReader/>
                    <p>
                        &copy; MURAGE
                    </p>
                </main>
            </div>
        </ApolloProvider>
    );
}

export default App;
