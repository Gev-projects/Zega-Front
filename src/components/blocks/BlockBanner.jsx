// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';
import { url } from '../../helper';

export default function BlockBanner(props) {
    return (
        <div className="block block-banners">
            <div className="container_fms">
                <Link to="/" className="block-banner__bodys">
                    <div>
                        <img src={url+'/storage/'+props.url} alt=""/>
                    </div>
          
                </Link>
            </div>
        </div>
    );
}
