import {gql, useQuery} from "@apollo/client";
import {useState} from "react";

const BOOK = gql`
  query books {
    book {
    pages {
      pageIndex,
      content,
      tokens {
        position,
        value
      }
    }
  }
  }
`;

function BasePage() {
    const {data, loading, error} = useQuery(BOOK);
    const [shouldShowDialog, setShouldShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(undefined);

    if (loading) {
        return <div>loading</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleWordClick = (tokens, wordIndex) => {
        // There was a problem with hyphens not being included in the tokens
        // so automatic mapping (by index) does not work in 100% of the cases.

        // manually picking text at its position
        const token = tokens.filter(({position: [start, end], value}) => start === wordIndex)[0] ?? {};

        console.log({token, index: wordIndex});
        setShouldShowDialog(true);
        setDialogContent(token);
    }

    const closeDialog = () => setShouldShowDialog(false);

    const ignoreClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const dialog = () => {
        return <div className={"overlay"} onClick={closeDialog}>
            <div className={"modal-dialog"} onClick={ignoreClick}>
                {/*<h4>Modal dialog</h4>*/}
                <p>{dialogContent?.value ?? "No content"}</p>
                <p className={"dismiss-message"}>Click outside this modal dialog to dismiss.</p>
            </div>
        </div>
    }

    return <>
        {shouldShowDialog ? dialog() : ''}
        <div style={{color: "#fafafa", width: "100%"}}>
        {
            data.book.pages.map(({pageIndex, content, tokens}) => {
                const words = content.split(" ");
                return <div className={"page-widget"}>
                        <div className={"card"}>
                            <div className={"page-content"}>{
                                words.map((word, index) => {
                                    return <span className={"word"}
                                                 style={{cursor: "pointer"}}
                                                 onClick={() => handleWordClick(tokens, content.indexOf(word))}>
                                            {word}</span>
                                })
                            }
                            </div>
                        </div>
                    </div>;
            })
        }
    </div>
        </>
}

export default BasePage;
