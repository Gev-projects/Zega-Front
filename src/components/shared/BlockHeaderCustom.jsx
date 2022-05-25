import React from 'react';


function BlockHeaderCustom(props){
    return (
         <div className="block-header">

            <h3 className="block-header__title__custom">{props.title}</h3>
             
           
        </div>
    )
}


export default BlockHeaderCustom