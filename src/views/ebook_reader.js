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

function EBookReader() {
    const {data, loading, error} = useQuery(BOOK);
    const [shouldShowModal, setShouldShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(undefined);
    const [currPage, setCurrPage] = useState(0);

    if (loading) {
        return <div className={"card"}>loading</div>;
    }

    if (error) {
        return <div className={"card error"}>{error}</div>;
    }

    const handleWordClick = (tokens, wordIndex) => {
        // There was a problem with hyphens not being included in the tokens
        // so automatic mapping (by index) does not work in 100% of the cases.

        // thus, manually picking text by its position
        const token = tokens.filter(({position: [start, end], value}) => start === wordIndex)[0] ?? {};

        // console.log({token, index: wordIndex});
        setShouldShowModal(true);
        setModalContent(token);
    }

    const closeDialog = () => setShouldShowModal(false);

    const ignoreClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    // For the second view in question, I decided to use a modal dialog instead.
    // Reason: Cleaner, more intuitive & more user-friendly
    // Since
    // It does not interrupt the reading flow.
    // Reading resumes where you left after you dismiss it.
    const dialog = () => {
        return <div className={"overlay"} onClick={closeDialog}>
            <div className={"modal-dialog"} onClick={ignoreClick}>
                {/*<h4>Modal dialog</h4>*/}
                <p>{modalContent?.value ?? "No content"}</p>
                <p className={"dismiss-message"}>Click outside this modal dialog to dismiss it.</p>
            </div>
        </div>
    }

    // Pagination controls
    const thisPage = data?.book?.pages[currPage] ?? {};
    const nextPage = data?.book?.pages[currPage + 1] ?? {}; // defaulting to empty page if page doesn't exit in list

    const {pageIndex: firstPageNo, content: content1, tokens: tokens1} = thisPage;
    const {pageIndex: nextPageNo, content: content2, tokens: tokens2} = nextPage;

    const words1 = content1.split(" "); // words in page one of the 2-page view
    const words2 = content2.split(" "); // words in page two of the 2-page view

    const goToPrevPage = () => {
        setCurrPage(currPage <= 2 ? 0 : currPage - 2);
    }

    const goToNextPage = () => {
        const finalPage = data?.book?.pages?.length ? data?.book?.pages?.length - 2 : 0;
        setCurrPage(currPage === finalPage ? finalPage : currPage + 2);
    }

    // The actual view
    return <>
        {shouldShowModal ? dialog() : ''} {/*conditionally display modal dialog*/}

        <div className={"navigation"}>
            <button className={"nav-btn"} onClick={goToPrevPage}>Prev</button>
            <span>Current page: {firstPageNo + 1} & {firstPageNo + 2}</span>
            <button className={"nav-btn"} onClick={goToNextPage}>Next</button>
        </div>

        {/* Book */}
        <div style={{color: "#fafafa", width: "100%"}}>
            <div className={"page-widget"}>
                {/* Page 1 */}
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

                {/* Vertical Divider */}
                <div className={"divider"}/>

                {/* Page 2 */}
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
        </div>
    </>
}

export default EBookReader;
