// react
import React from 'react';
import { connect } from 'react-redux';

function Currency(props) {
    let { value } = props;

    // var zero = value.charAt(0);
    // value = value.substring(1)

    return <React.Fragment>{value}</React.Fragment>;

}

const mapStateToProps = (state) => ({
    currentCurrency: state.currency,
});

export default connect(mapStateToProps)(Currency);
