// // // react
// // import React, {
// //     useCallback,
// //     useEffect,
// //     useRef,
// //     useState
// // } from 'react';
// //
// // // third-party
// // import classNames from 'classnames';
// // import { useLocation, useHistory } from 'react-router-dom'
// // import Suggestions from './Suggestions';
// // import { Cross20Svg, Search20Svg } from '../../svg';
// // import { FormattedMessage } from 'react-intl';
// //
// // import { useSelector } from 'react-redux'
// // import queryString from 'query-string';
// // import shopApi from "../../api/shop";
// //
// //
// //
// // function Search(props) {
// //     const {
// //         context,
// //         className,
// //         inputRef,
// //         onClose,
// //     } = props;
// //
// //     const history = useHistory();
// //     const location = useLocation();
// //
// //     const [query, setQuery] = useState('');
// //
// //     const [cancelFn, setCancelFn] = useState(() => () => {});
// //     const [suggestionsOpen, setSuggestionsOpen] = useState(false);
// //     const [hasSuggestions, setHasSuggestions] = useState(false);
// //     const [suggestedProducts, setSuggestedProducts] = useState([]);
// //     const selectedData = useSelector(state=>state.locale);
// //     const [category, setCategory] = useState('[all]');
// //     const wrapper = useRef(null);
// //
// //     const close = useCallback(() => {
// //         if (onClose) {
// //             onClose();
// //         }
// //         setSuggestionsOpen(false);
// //     }, [onClose]);
// //
// //
// //
// //     useEffect(()=>{
// //        const {search}= queryString.parse(window.location.search);
// //         if(search) {
// //            setQuery(search)
// //        }
// //
// //
// //     }, [
// //         location,
// //     ]);
// //
// //     useEffect(()=>{
// //         const params = queryString.parse(location.search);
// //     }, [
// //         location.search
// //     ])
// //
// //
// //     // Close suggestions when the location has been changed.
// //     useEffect(() => close(), [close, location]);
// //
// //     // Close suggestions when a click has been made outside component.
// //     useEffect(() => {
// //         const onGlobalClick = (event) => {
// //             if (wrapper.current && !wrapper.current.contains(event.target)) {
// //                 close();
// //             }
// //         };
// //
// //         document.addEventListener('mousedown', onGlobalClick);
// //
// //         return () => document.removeEventListener('mousedown', onGlobalClick);
// //     }, [close]);
// //
// //     // Cancel previous typing.
// //     useEffect(() => () => cancelFn(), [cancelFn]);
// //
// //     const handleFocus = () => {
// //         setSuggestionsOpen(true);
// //     };
// //
// //     const handleChangeQuery = (event) => {
// //         let canceled = false;
// //         let timer;
// //
// //         const newCancelFn = () => {
// //             canceled = true;
// //             clearTimeout(timer);
// //         };
// //
// //         const query = event.target.value;
// //
// //         setQuery(query);
// //
// //         if (query === '') {
// //             setHasSuggestions(false);
// //         } else {
// //             timer = setTimeout(() => {
// //                 const options = { limit: 10 ,lang:selectedData};
// //
// //                 if (category !== '[all]') {
// //                     options.category = category;
// //                 }
// //
// //                 // shopApi.getSeachProducts(query, options).then((products) => {
// //                 //     if (canceled) {
// //                 //         return;
// //                 //     }
// //                 //     setSuggestedProducts(products.data);
// //                 //     setHasSuggestions(products.data.length > 0);
// //                 //     setSuggestionsOpen(true);
// //                 // });
// //             }, 100);
// //         }
// //
// //         setCancelFn(() => newCancelFn);
// //     };
// //
// //     const handleBlur = () => {
// //         setTimeout(() => {
// //             if (!document.activeElement || document.activeElement === document.body) {
// //                 return;
// //             }
// //
// //             // Close suggestions if the focus received an external element.
// //             if (wrapper.current && !wrapper.current.contains(document.activeElement)) {
// //                 close();
// //             }
// //         }, 10);
// //     };
// //
// //     // Close suggestions when the Escape key has been pressed.
// //     const handleKeyDown = (event) => {
// //         // Escape.
// //         if (event.which === 27) {
// //             close();
// //         }
// //
// //         if(event.which==13){
// //             event.preventDefault()
// //             inputRef.current.blur();
// //             const params = queryString.parse(window.location.search);
// //             history.push({
// //                 pathname: '/shop/catalog',
// //                 // search: queryString.stringify({
// //                 //     ...params,
// //                 //     search:query,
// //                 // })
// //             })
// //         }
// //     };
// //
// //     const rootClasses = classNames(`search search--location--${context}`, className, {
// //         'search--suggestions-open': suggestionsOpen,
// //         'search--has-suggestions': hasSuggestions,
// //     });
// //
// //     const closeButton = context !== 'mobile-header' ? '' : (
// //         <button className="rsearch__button search__button--type--close" type="button" onClick={close}>
// //             <Cross20Svg />
// //         </button>
// //     );
// //
// //
// //
// //     return (
// //         <div className={rootClasses} ref={wrapper} onBlur={handleBlur}>
// //             <div className="search__body">
// //
// //                 <form className="search__form" action="">
// //
// //
// //
// //                     <FormattedMessage id="search" defaultMessage="Որոնել" >
// //
// //
// //
// //                          { placeholder => <input
// //                                                 ref={inputRef}
// //                                                 onChange={handleChangeQuery}
// //                                                 onFocus={handleFocus}
// //                                                 onKeyDown={handleKeyDown}
// //                                                 value={queryString.parse(location.search).search || query}
// //                                                 className="search__input"
// //                                                 name="search"
// //                                                 placeholder={placeholder}
// //                                                 aria-label="Site search"
// //                                                 type="text"
// //                                                 autoComplete="off"
// //                                             />
// //
// //                         }
// //                         </FormattedMessage>
// //
// //                     <button  className="search__button search__button--type--submit" type="submit">
// //                         <Search20Svg />
// //                     </button>
// //                     {closeButton}
// //                     <div className="search__border" />
// //                 </form>
// //
// //                 <Suggestions className="search__suggestions" context={context} products={suggestedProducts} />
// //             </div>
// //         </div>
// //     );
// // }
// //
// // export default Search;
// //
//
//
//
//
//
//
//
//
// // react
// import React, {
//     useCallback,
//     useEffect,
//     useRef,
//     useState
// } from 'react';
//
// // third-party
// import classNames from 'classnames';
// import { useLocation, useHistory } from 'react-router-dom'
// import Suggestions from './Suggestions';
// import { Cross20Svg, Search20Svg } from '../../svg';
// import { FormattedMessage } from 'react-intl';
//
// import { useSelector } from 'react-redux'
// import queryString from 'query-string';
// import shopApi from '../../api/shop';
//
//
//
// function Search(props) {
//     const {
//         context,
//         className,
//         inputRef,
//         onClose,
//     } = props;
//
//     const history = useHistory();
//     const location = useLocation();
//
//     const [query, setQuery] = useState('');
//
//     const [cancelFn, setCancelFn] = useState(() => () => {});
//     const [suggestionsOpen, setSuggestionsOpen] = useState(false);
//     const [hasSuggestions, setHasSuggestions] = useState(false);
//     const [suggestedProducts, setSuggestedProducts] = useState([]);
//     const selectedData = useSelector(state=>state.locale);
//     const [category, setCategory] = useState('[all]');
//     const wrapper = useRef(null);
//     const close = useCallback(() => {
//         if (onClose) {
//             onClose();
//         }
//         setSuggestionsOpen(false);
//     }, [onClose]);
//
//     useEffect(()=>{
//         const {search}= queryString.parse(window.location.search);
//         if(search) {
//             setQuery(search)
//         }
//     }, [
//         location,
//     ]);
//
//     useEffect(()=>{
//         // setSuggestedProducts([{id: 1, name: 'Arman'},{id: 2, name: 'Seyran'},{id: 3, name: 'Rubik'}])
//         const params = queryString.parse(location.search);
//     }, [
//         location.search
//     ])
//
//     // Close suggestions when the location has been changed.
//     useEffect(() => close(), [close, location]);
//
//     // Close suggestions when a click has been made outside component.
//     useEffect(() => {
//         const onGlobalClick = (event) => {
//             if (wrapper.current && !wrapper.current.contains(event.target)) {
//                 close();
//             }
//         };
//
//         document.addEventListener('mousedown', onGlobalClick);
//
//         return () => document.removeEventListener('mousedown', onGlobalClick);
//     }, [close]);
//
//     // Cancel previous typing.
//     useEffect(() => () => cancelFn(), [cancelFn]);
//
//     const handleFocus = () => {
//         setSuggestionsOpen(true);
//     };
//
//     const handleChangeQuery = (event) => {
//         let canceled = false;
//         let timer;
//
//         const newCancelFn = () => {
//             canceled = true;
//             clearTimeout(timer);
//         };
//
//         const query = event.target.value;
//
//         setQuery(query);
//
//         if (query === '') {
//             setHasSuggestions(false);
//         } else {
//             timer = setTimeout(() => {
//                 const options = { limit: 10 ,lang:selectedData};
//
//                 if (category !== '[all]') {
//                     options.category = category;
//                 }
//
//                 shopApi.getSeachProducts(query, options).then((products) => {
//                     if (canceled) {
//                         return;
//                     }
//                     setSuggestedProducts(products.data);
//                     setHasSuggestions(products.data.length > 0);
//                     setSuggestionsOpen(true);
//                 });
//             }, 100);
//         }
//
//         setCancelFn(() => newCancelFn);
//     };
//
//     const handleBlur = () => {
//         setTimeout(() => {
//             if (!document.activeElement || document.activeElement === document.body) {
//                 return;
//             }
//
//             // Close suggestions if the focus received an external element.
//             if (wrapper.current && !wrapper.current.contains(document.activeElement)) {
//                 close();
//             }
//         }, 10);
//     };
//
//     // Close suggestions when the Escape key has been pressed.
//     const handleKeyDown = (event) => {
//         // Escape.
//         if (event.which === 27) {
//             close();
//         }
//
//         if(event.which==13) {
//             event.preventDefault()
//             inputRef.current.blur()
//             localStorage.setItem('searchProductsFm', JSON.stringify(suggestedProducts))
//             const params = queryString.parse(window.location.search);
//             history.push({
//                 pathname: '/shop/catalog/search',
//             })
//         }
//     };
//
//     const handleSearchButt = () => {
//         localStorage.setItem('searchProductsFm', JSON.stringify(suggestedProducts))
//         history.push({
//             pathname: '/shop/catalog/search',
//         })
//     }
//
//     const rootClasses = classNames(`search search--location--${context}`, className, {
//         'search--suggestions-open': suggestionsOpen,
//         'search--has-suggestions': hasSuggestions,
//     });
//
//     const closeButton = context !== 'mobile-header' ? '' : (
//         <button className="search__button search__button--type--close" type="button" onClick={close}>
//             <Cross20Svg />
//         </button>
//     );
//
//
//
//     return (
//         <div className={rootClasses} ref={wrapper} onBlur={handleBlur}>
//             <div className="search__body">
//                 <div className="search__form">
//
//                     <FormattedMessage id="search12" defaultMessage="Search" >
//
//                         { placeholder => <input
//                             ref={inputRef}
//                             onChange={handleChangeQuery}
//                             onFocus={handleFocus}
//                             onKeyDown={handleKeyDown}
//                             value={queryString.parse(location.search).search || query}
//                             className="search__input"
//                             name="search"
//                             placeholder={placeholder}
//                             aria-label="Site search"
//                             type="text"
//                             autoComplete="off"
//                         />
//
//                         }
//                     </FormattedMessage>
//
//                     <button className="search__button search__button--type--submit"  onClick={() => handleSearchButt()}>
//                         <Search20Svg />
//                     </button>
//                     {closeButton}
//                     <div className="search__border" />
//                 </div>
//
//                 <Suggestions className="search__suggestions" context={context} products={suggestedProducts} />
//             </div>
//         </div>
//     );
// }
//
// export default Search;
//
//
//

// react
import React, { useCallback, useEffect, useRef, useState } from "react";

// third-party
import classNames from "classnames";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import queryString from "query-string";
import { Cross20Svg, Search20Svg } from "../../svg";
import Suggestions from "./Suggestions";
import shopApi from "../../api/shop";

function Search(props) {
    const { context, className, inputRef, onClose } = props;

    const history = useHistory();
    const location = useLocation();

    const [query, setQuery] = useState("");

    const [cancelFn, setCancelFn] = useState(() => () => {});
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const selectedData = useSelector((state) => state.locale);
    const [category, setCategory] = useState("[all]");
    const wrapper = useRef(null);
    const close = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setSuggestionsOpen(false);
    }, [onClose]);

    useEffect(() => {
        const { search } = queryString.parse(window.location.search);
        if (search) {
            setQuery(search);
        }
    }, [location]);

    useEffect(() => {
        // setSuggestedProducts([{id: 1, name: 'Arman'},{id: 2, name: 'Seyran'},{id: 3, name: 'Rubik'}])
        const searchedItem = queryString.parse(location.search);
    }, [location.search]);

    // Close suggestions when the location has been changed.
    useEffect(() => close(), [close, location]);

    // Close suggestions when a click has been made outside component.
    useEffect(() => {
        const onGlobalClick = (event) => {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", onGlobalClick);

        return () => document.removeEventListener("mousedown", onGlobalClick);
    }, [close]);

    // Cancel previous typing.
    useEffect(() => () => cancelFn(), [cancelFn]);

    const handleFocus = () => {
        setSuggestionsOpen(true);
    };

    const handleChangeQuery = (event) => {
        let canceled = false;
        let timer;

        const newCancelFn = () => {
            canceled = true;
            clearTimeout(timer);
        };

        const query = event.target.value;

        setQuery(query);

        if (query === "") {
            setHasSuggestions(false);
        } else {
            timer = setTimeout(() => {
                const options = { limit: 10, lang: selectedData };

                if (category !== "[all]") {
                    options.category = category;
                }

                shopApi.getSeachProducts(query, options).then((products) => {
                    if (canceled) {
                        return;
                    }
                    if (products.data.length) {
                        setSuggestedProducts(products.data);
                        setHasSuggestions(products.data.length > 0);
                        setSuggestionsOpen(true);
                    } else {
                        setSuggestedProducts([{ name: query, id: -1 }]);
                        setHasSuggestions(products.data.length == 0);
                        setSuggestionsOpen(true);
                    }
                });
            }, 100);
        }

        setCancelFn(() => newCancelFn);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                return;
            }

            // Close suggestions if the focus received an external element.
            if (wrapper.current && !wrapper.current.contains(document.activeElement)) {
                close();
            }
        }, 10);
    };

    const params = new URLSearchParams(location.search);

    // Close suggestions when the Escape key has been pressed.
    const handleKeyDown = (event) => {
        // Escape.
        if (event.which === 27) {
            close();
        }

        if (event.which == 13) {
            event.preventDefault();
            localStorage.setItem("searchProductsFm", JSON.stringify(suggestedProducts));
            const params = queryString.parse(window.location.search);
            history.push({
                pathname: `/catalog/search/${query}`,
            });
        }
    };

    const handleSearchButt = () => {
        localStorage.setItem("searchProductsFm", JSON.stringify(suggestedProducts));
        history.push({
            pathname: "/catalog/search/" + query,
        });
    };

    const rootClasses = classNames(`search search--location--${context}`, className, {
        "search--suggestions-open": suggestionsOpen,
        "search--has-suggestions": hasSuggestions,
    });

    const closeButton =
        context !== "mobile-header" ? (
            ""
        ) : (
            <button className="search__button search__button--type--close" type="button" onClick={close}>
                <Cross20Svg />
            </button>
        );

    return (
        <div className={rootClasses} ref={wrapper} onBlur={handleBlur}>
            <div className="search__body">
                <div className="search__form">
                    <FormattedMessage id="search12" defaultMessage="I am looking for․․.">
                        {(placeholder) => (
                            <input
                                ref={inputRef}
                                onChange={handleChangeQuery}
                                onFocus={handleFocus}
                                onKeyDown={handleKeyDown}
                                value={queryString.parse(location.search).search || query}
                                className="search__input"
                                name="search"
                                placeholder={placeholder}
                                aria-label="Site search"
                                type="text"
                                autoComplete="off"
                            />
                        )}
                    </FormattedMessage>

                    <button
                        className="search__button search__button--type--submit"
                        onClick={() => {
                            if (suggestedProducts[0].id != -1) {
                                handleSearchButt();
                                setQuery("");
                            }
                        }}
                    >
                        {/*<FormattedMessage id="searchBtn" defaultMessage="Search" />*/}
                        <Search20Svg />
                    </button>
                    {/* {closeButton} */}
                    <div className="search__border" />
                </div>

                <Suggestions
                    className="search__suggestions"
                    context={context}
                    products={suggestedProducts}
                    setQuery={setQuery}
                />
            </div>
        </div>
    );
}

export default Search;
