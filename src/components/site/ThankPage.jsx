// react
import React from 'react';
import { useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

// application
import { Check100Svg } from '../../svg';
function ThankPage(props) {
  const { id, orderID } = queryString.parse(props.location.search)

  useEffect(() => {
    ReactPixel.trackCustom('Purchase')
  }, [])

  let iframe;
  if (orderID || id) {

    if (id) {
      iframe = `<iframe src="https://testpayments.ameriabank.am/forms/frm_checkprint.aspx?lang=am&paymentid=${id}" width="100%" height="1000px"></iframe>`;
    } else {

      iframe = '<div style="height:250px"></dov>'
    }

  } else {

    window.location = '/'
  }

  const createMarkup = (item) => {
    return { __html: item };
  }
  return (


    <div className="container">
      <div className="row justify-content-center">

        <div className="order-success__body">
          <div className="order-success__header">
            <Check100Svg className="order-success__icon" />
            <h1 className="order-success__title">Thank you</h1>
            <div className="order-success__subtitle">Your order #{orderID} has been received</div>
            <div className="order-success__actions">
              <Link to="/" className="btn btn-secondary">Go To Homepage</Link>
            </div>
          </div>
        </div>

        <div style={{

          height: '100%'
        }} className={'col-md-12 '} dangerouslySetInnerHTML={createMarkup(iframe)}></div>


      </div>
    </div>

  );

}



export default ThankPage;
