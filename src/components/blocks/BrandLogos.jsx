import React, { Component } from 'react';
import shopApi from '../../api/shop';


class BrandLogos extends Component{

    constructor(props){
        super(props);

        this.state = {
            brands: null
        }
    }

    componentDidMount(){
        shopApi.getBrands().then(res => this.setState({brands: res['data'][0]}))
    }

render(){
    const {brands} = this.state

    // const brandsList = brands && brands.options.length? brands.map((brand,index) =>
    //                         <>
    //                             <div className="brand-logos-body">
    //                                 {/* <img src={brand.} alt=""/> */}
    //                             </div>
    //                         </>
    //                     ): ''


    return(
        <div></div>
        // <div className="logos-container">
        //     {brands && brands.options.length? <h3 className="block-header__title__custom">Brands</h3>: ''}
        //     {brandsList}
        // </div>
    )
}

}

export default BrandLogos;
