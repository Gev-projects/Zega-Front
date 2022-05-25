// // react
// import React from "react";
//
// // third-party
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
//
// // application
// import Pagination from "../shared/Pagination";
//
// import theme from "../../data/theme";
//
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useState } from "react";
// import { url } from "../../helper";
// import BlockLoader from "../blocks/BlockLoader";
// import { FormattedMessage } from "react-intl";
//
// const AccountPageOrders = () => {
//     const customer = useSelector((state) => state.customer);
//     const [page, setPage] = useState(1);
//     const [orders, setOrders] = useState();
//     const [loading, setLoading] = useState(false);
//     useEffect(() => {
//         if (customer.token) {
//             let urlPage = "";
//             if (page) {
//                 urlPage = "&page=" + page;
//             }
//             fetch(url + `/api/orders?customer_id=${customer.customerId}&token=${customer.token}` + urlPage)
//                 .then((response) => response.json())
//
//                 .then((res) => {
//                     setOrders(res);
//                     setLoading(false);
//                 });
//         }
//     }, [customer.token, page]);
//
//     const handlePageChange = (page) => {
//         setPage(page);
//         setLoading(true);
//     };
//
//     if (!orders || loading) {
//         return <BlockLoader />;
//     }
//
//     function formatDate(date) {
//         let cleared = date.split("-");
//         let year = cleared[0];
//         let month = cleared[1];
//         let day = cleared[2].slice(0, 2);
//         return day + "/" + month + "/" + year;
//     }
//
//     const ordersList = orders.data.map((order) => {
//         let date = formatDate(order.created_at);
//         return (
//             <tr key={order.id}>
//                 <td>
//                     <Link to={`/account/orders/${order.id}`}>{`#${order.id}`}</Link>
//                 </td>
//                 <td>{date}</td>
//                 <td>{order.sub_total}</td>
//                 <td>{order.tax_amount}</td>
//                 <td>{order.shipping_amount}</td>
//                 <td>{order.status}</td>
//             </tr>
//         );
//     });
//
//     return (
//         <div className="card">
//             <Helmet>
//                 <title>{`Order History — ${theme.name}`}</title>
//             </Helmet>
//
//             {/*<div className="card-header">*/}
//             {/*    <h5>*/}
//             {/*        <FormattedMessage id="orderHistory" defaultMessage="Order history" />*/}
//             {/*    </h5>*/}
//             {/*</div>*/}
//             {/*<div className="card-divider" />*/}
//             <div className="card-table">
//                 <div className="table-responsive-sm">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>
//                                     <FormattedMessage id="order.id" defaultMessage="ID" />
//                                 </th>
//                                 <th>
//                                     <FormattedMessage id="order.date" defaultMessage="Date" />
//                                 </th>
//                                 <th>
//                                     <FormattedMessage id="orders-price" defaultMessage="Price" />
//                                 </th>
//                                 <th>
//                                     <FormattedMessage id="tax" defaultMessage="Tax" />
//                                 </th>
//                                 <th>
//                                     <FormattedMessage id="orders-shipping" defaultMessage="Shipping" />
//                                 </th>
//                                 <th>
//                                     <FormattedMessage id="order.status" defaultMessage="Status" />
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>{ordersList}</tbody>
//                     </table>
//                 </div>
//             </div>
//             <div className="card-divider" />
//             <div className="card-footer">
//                 {orders.data.length > 0 ? (
//                     <Pagination current={page} total={orders.data.length} onPageChange={handlePageChange} />
//                 ) : (
//                     ""
//                 )}
//             </div>
//         </div>
//     );
//     // }
// };
//
// export default AccountPageOrders;

// react
import React, { useState, useEffect } from "react";

// third-party
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// application
import Pagination from "../shared/Pagination";

import theme from "../../data/theme";

import { useSelector } from "react-redux";
import { url } from "../../helper";
import BlockLoader from "../blocks/BlockLoader";
import { FormattedMessage } from "react-intl";

const AccountPageOrders = () => {
    const customer = useSelector((state) => state.customer);
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState();
    const [loading, setLoading] = useState(false);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (customer.token) {
            let urlPage = "";
            if (page) {
                urlPage = "&page=" + page;
            }
            fetch(url + `/api/orders?customer_id=${customer.customerId}&token=${customer.token}` + urlPage)
                .then((response) => response.json())

                .then((res) => {
                    setOrders(res);
                    setLoading(false);
                });
        }
    }, [customer.token, page]);

    useEffect(() => {
        function handleResize() {
            setInnerWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
    }, [window.innerWidth]);

    const handlePageChange = (page) => {
        setPage(page);
        setLoading(true);
    };
    if (!orders || loading) {
        return <BlockLoader />;
    }

    function formatDate(date) {
        let cleared = date.split("-");
        let year = cleared[0];
        let month = cleared[1];
        let day = cleared[2].slice(0, 2);
        return day + "/" + month + "/" + year;
    }

    const ordersList = orders.data.map((order) => {
        let date = formatDate(order.created_at);
        return (
            <tr key={order.id}>
                <td>
                    <Link className="text-underline" to={`/account/orders/${order.id}`}>{`#${order.id}`}</Link>
                </td>
                <td>{date}</td>
                <td>{order.formated_sub_total}</td>
                <td>{order.formated_tax_amount}</td>
                <td>{order.formated_shipping_amount}</td>
                <td>{order.status}</td>
            </tr>
        );
    });

    const mobileOrderList = orders.data.map((order) => {
        let date = formatDate(order.created_at);
        return (
            <div className="card border-input-light mb-5" key={order.id}>
                <div className="card-table">
                    {/*<div className="table-responsive-sm">*/}
                    <table className="mobile-orders-table">
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-id" defaultMessage="ID" />
                            </th>
                            <td>
                                <Link
                                    className="text-underline"
                                    to={`/account/orders/${order.id}`}
                                >{`#${order.id}`}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-date" defaultMessage="Date" />
                            </th>
                            <td>{date}</td>
                        </tr>
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-price" defaultMessage="Price" />
                            </th>
                            <td>{order.formated_sub_total}</td>
                        </tr>
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-tax" defaultMessage="Tax" />
                            </th>
                            <td>{order.formated_tax_amount}</td>
                        </tr>
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-shipping" defaultMessage="Shipping" />
                            </th>
                            <td>{order.formated_shipping_amount}</td>
                        </tr>
                        <tr>
                            <th>
                                <FormattedMessage id="mob-order-status" defaultMessage="Status" />
                            </th>
                            <td>{order.status}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    });

    if (innerWidth > 575) {
        return (
            <div className="card border-input-light">
                <Helmet>
                    <title>{`Order History — ${theme.name}`}</title>
                </Helmet>

                {/*<div className="card-header">*/}
                {/*    <h5>*/}
                {/*        <FormattedMessage id="orderHistory" defaultMessage="Order history" />*/}
                {/*    </h5>*/}
                {/*</div>*/}
                <div className="card-divider" />
                <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead className="desktop-order-list">
                                <tr>
                                    <th>
                                        <FormattedMessage id="order-id" defaultMessage="ID" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="order-date" defaultMessage="Date" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="order-price" defaultMessage="Price" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="order-tax" defaultMessage="Tax" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="order-shipping" defaultMessage="Shipping" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="order-status" defaultMessage="Status" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{ordersList}</tbody>
                        </table>
                    </div>
                </div>
                <div className="card-divider" />
                <div className="card-footer d-flex justify-content-end">
                    {orders.data.length > 0 ? (
                        <Pagination current={page} total={orders.data.length} onPageChange={handlePageChange} />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    } else {
        return mobileOrderList;
    }
};

export default AccountPageOrders;
