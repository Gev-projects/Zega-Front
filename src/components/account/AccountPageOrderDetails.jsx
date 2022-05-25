// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { url } from "../../helper";
import { useSelector } from "react-redux";
import { useState } from "react";
import BlockLoader from "../blocks/BlockLoader";
import { FormattedMessage } from "react-intl";
// import { unstable_batchedUpdates } from "react-redux/lib/utils/reactBatchedUpdates.native";

export default function AccountPageOrderDetails({ id }) {
    const customer = useSelector((state) => state.customer);
    const [order, setOrder] = useState();
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setInnerWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
    }, [window.innerWidth]);

    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;

        if (id.orderId && customer.token) {
            fetch(url + `/api/orders/${id.orderId}?token=` + customer.token, { single: single })
                .then((responce) => responce.json())
                .then((res) => {
                    if (res.data) {
                        setOrder(res.data);
                    }
                })
                .catch((err) => console.error(err));
        }

        return function cleaup() {
            abortController.abort();
        };
    }, [id.orderId]);

    if (!order) {
        return <BlockLoader />;
    }

    const productDetails = order.items.map((item, index) => {
        return (
            <tr key={index} className="text-center">
                <td>{item.name}</td>
                <td>{item.formated_price}</td>
                <td>{item.qty_ordered}</td>
                <td>{item.formated_total}</td>
            </tr>
        );
    });
    const items = (
        <tr className="text-center">
            <td>{order.shipping_address.address1[0]}</td>
            <td>{order.billing_address.address1[0]}</td>
            <td>{order.payment_title}</td>
        </tr>
    );

    const orderDetails = (
        <table className="order-details-info-table order-details-info-table-mobile">
            <tr>
                <th>
                    <FormattedMessage id="order-details-subtotal" defaultMessage="Subtotal" />
                </th>
                <td>{order.formated_sub_total}</td>
            </tr>
            <tr>
                <th>
                    <FormattedMessage id="order-details-shipping" defaultMessage="Shipping" />
                </th>
                <td>{order.formated_shipping_amount}</td>
            </tr>
            <tr>
                <th>
                    <FormattedMessage id="order-details-tax" defaultMessage="Tax" />
                </th>
                <td>{order.formated_tax_amount}</td>
            </tr>
            <tr>
                <th>
                    <FormattedMessage id="order-details-total" defaultMessage="Total" />
                </th>
                <td>{order.formated_grand_total}</td>
            </tr>
            <tr>
                <th>
                    <FormattedMessage id="order-details-status" defaultMessage="Status" />
                </th>
                <td>{order.status}</td>
            </tr>
        </table>
    );

    const productNamesForMobile = order.items.map((item, index) => {
        return (
            <div key={index} className="children-margins d-flex flex-row justify-content-between">
                <span>{item.name}</span>
                <span>{item.qty_ordered}</span>
                <span>x</span>
                <span>{item.formated_price}</span>
                <span>{item.formated_total}</span>
            </div>
        );
    });

    if (innerWidth > 540) {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Order Details — ${theme.name}`}</title>
                </Helmet>

                <div className="card">
                    <div className="order-header">
                        <div className="order-header__actions">
                            <Link to="/account/orders" className="btn btn-md btn-secondary f16">
                                <FormattedMessage id="backToList" defaultMessage="Back to list" />
                            </Link>
                        </div>
                        <h5 className="order-header__title">
                            <FormattedMessage id="order-inner-title" defaultMessage="Order" /> #{order.id}
                        </h5>
                    </div>
                    {/*<div className="card-divider" />*/}
                    <div className="card-table">
                        <div className="table-responsive-sm">
                            <table>
                                <thead className="order-details-headers-tr">
                                    <tr className="text-center">
                                        <th>
                                            <FormattedMessage
                                                id="order-inner-ship-address"
                                                defaultMessage="Shipping address"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="order-inner-bill-address"
                                                defaultMessage="Billing address"
                                            />
                                        </th>
                                        <th>
                                            <FormattedMessage
                                                id="order-inner-pay-method"
                                                defaultMessage="Payment method"
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="card-table__body card-table__body--merge-rows">{items}</tbody>

                                {/*<tfoot>*/}
                                {/*    <tr>*/}
                                {/*        <th>*/}
                                {/*            <FormattedMessage id="total" defaultMessage="Total" />*/}
                                {/*        </th>*/}
                                {/*        <td>{order.formated_sub_total}</td>*/}
                                {/*    </tr>*/}
                                {/*</tfoot>*/}
                            </table>
                            <div className="card-divider" />
                            <table>
                                <thead>
                                    <tr className="orders-inner-product-details">
                                        <th>
                                            <FormattedMessage id="order-inner-product" defaultMessage="Product" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="order-inner-price" defaultMessage="Price" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="order-inner-qnt" defaultMessage="Quantity" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="order-inner-total" defaultMessage="Total Price" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="card-table__body orders-inner-product-details card-table__body--merge-rows">
                                    {productDetails}
                                </tbody>
                            </table>
                            <div className="order-details-info">
                                {/*<span className="font-bold">*/}
                                {/*    <FormattedMessage id="order-details-comment" defaultMessage="Comment" />*/}
                                {/*</span>*/}
                                {orderDetails}
                                <div className="reorder-btn-parent">
                                    <button className="btn btn-primary f16 btn-primary-fms reorder-btn">
                                        <FormattedMessage id="orders-reorder-btn" defaultMessage="Reorder" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else {
        return (
            <div className="card px-4">
                <div className="d-flex justify-content-between mb-5">
                    <span className="font-weight-bold f18">
                        <FormattedMessage id="order-inner-title" defaultMessage="Order" /> #{order.id}
                    </span>
                    <Link to="/account/orders" className="btn btn-xs btn-secondary f14">
                        <FormattedMessage id="backToList" defaultMessage="Back to list" />
                    </Link>
                </div>
                <div className="orders-inner-details-mobile d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between">
                        <span className="table-heading-descriptions">
                            <FormattedMessage id="order-inner-ship-address" defaultMessage="Shipping address" />
                        </span>
                        <span>{order.shipping_address.address1[0]}</span>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <span className="table-heading-descriptions">
                            <FormattedMessage id="order-inner-bill-address" defaultMessage="Billing address" />
                        </span>
                        <span>{order.billing_address.address1[0]}</span>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <span className="table-heading-descriptions">
                            <FormattedMessage id="order-inner-pay-method" defaultMessage="Payment method" />
                        </span>
                        <span className="text-right">{order.payment_title}</span>
                    </div>
                    {productNamesForMobile}
                </div>

                <div className="order-details-info-mobile">
                    {orderDetails}
                    <div className="reorder-btn-parent">
                        <button className="btn btn-primary f16 btn-primary-fms reorder-btn">
                            <FormattedMessage id="orders-reorder-btn" defaultMessage="Reorder" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
