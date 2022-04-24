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
    const [currPage, setCurrPage] = useState(0);

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

    const fPage = data?.book?.pages[currPage] ?? {};
    const nPage = data?.book?.pages[currPage + 1] ?? {}; // defaulting to empty page if page doesn't exit in list

    const {pageIndex: fPageNo, content: content1, tokens: tokens1} = fPage;
    const {pageIndex: nPageNo, content: content2, tokens: tokens2} = nPage;

    const words1 = content1.split(" ");
    const words2 = content2.split(" ");

    const goToPrevPage = () => {
        setCurrPage(currPage <= 2 ? 0 : currPage - 2);
    }

    const goToNextPage = () => {
        const finalPage = data?.book?.pages?.length ?  data?.book?.pages?.length - 2 : 0;
        setCurrPage(currPage === finalPage ? finalPage : currPage + 2);
    }

    return <>
        {shouldShowDialog ? dialog() : ''}
        <div className={"navigation"}>
            <button onClick={goToPrevPage}>Prev</button>
            <span>Current page: {fPageNo + 1} & {fPageNo + 2}</span>
            <button onClick={goToNextPage}>Next</button>
        </div>
        <div style={{color: "#fafafa", width: "100%"}}>
            <div className={"page-widget"}>
                <div className={"card"}>
                    <div className={"page-content"}>{
                        words1.map((word, index) => {
                            return <span className={"word"}
                                         style={{cursor: "pointer"}}
                                         onClick={() => handleWordClick(tokens1, content1.indexOf(word))}>
                                            {word}</span>
                        })
                    }
                    </div>
                </div>
                <div className={"divider"} ></div>
                <div className={"card"}>
                    <div className={"page-content"}>{
                        words2.map((word, index) => {
                            return <span className={"word"}
                                         style={{cursor: "pointer"}}
                                         onClick={() => handleWordClick(tokens2, content2.indexOf(word))}>
                                            {word}</span>
                        })
                    }
                    </div>
                </div>
            </div>
            {/*{*/}
            {/*    data.book.pages.map(({pageIndex, content, tokens}) => {*/}
            {/*        const words = content.split(" ");*/}
            {/*        return <div className={"page-widget"}>*/}
            {/*            <div className={"card"}>*/}
            {/*                <div className={"page-content"}>{*/}
            {/*                    words.map((word, index) => {*/}
            {/*                        return <span className={"word"}*/}
            {/*                                     style={{cursor: "pointer"}}*/}
            {/*                                     onClick={() => handleWordClick(tokens, content.indexOf(word))}>*/}
            {/*                                {word}</span>*/}
            {/*                    })*/}
            {/*                }*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className={"card"}>*/}
            {/*                <div className={"page-content"}>{*/}
            {/*                    words.map((word, index) => {*/}
            {/*                        return <span className={"word"}*/}
            {/*                                     style={{cursor: "pointer"}}*/}
            {/*                                     onClick={() => handleWordClick(tokens, content.indexOf(word))}>*/}
            {/*                                {word}</span>*/}
            {/*                    })*/}
            {/*                }*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>;*/}
            {/*    })*/}
            {/*}*/}
        </div>
    </>
}

export default BasePage;
