// react
import React, {useCallback,useState} from "react";
import { useEffect } from "react";
import { url} from "../../helper";
import { FormattedMessage } from "react-intl";


function ShippingMethod({ setShipingMethod, shippingMethod,locale}) {
    const [ShippingMethods, setShippingMethods] = useState(false);
    // console.log(setShipingMethod, shippingMethod)

    useEffect(() => {
        fetch(url + `/api/shipping?locale=${locale}`)
            .then((responce) => responce.json())
            .then((res) => {
                setShippingMethods(res);
            })
            .catch((err) => console.error(err));
    }, []);

    let content='';
    if(ShippingMethods){
            content = ShippingMethods.map(function(ShippingMethods) {
                if(ShippingMethods.active){
                    return (
                        <div className="shipping-methods">
                        <span className="input-radio__body">
                        <input type="radio" className="input-radio__input" value={ShippingMethods.code} name="shippingmethods" data-default_rate={ShippingMethods.default_rate} onChange={(e) => setShipingMethod(e.target)} />
                        <span className="input-radio__circle mr-3"  />
                        <span className="shipping-methods__item-titleshipping-methods__item-title-fms">
                            <FormattedMessage id={ShippingMethods.title} defaultMessage={ShippingMethods.title}
                                />
                        </span>
                        </span>
                    </div>
                    )
                }

            });
    }
   
    return (
        <div className="shipping-methods-content">
            <h3 className="checkout-card-title-fms">
            <FormattedMessage id="Shipping Methods" defaultMessage="Shipping Methods"/>
            </h3>
            {content}
       </div>
        )
}

export default ShippingMethod;