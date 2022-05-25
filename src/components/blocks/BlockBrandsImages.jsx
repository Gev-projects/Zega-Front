// react
import React from "react";
import { GroupSvg } from "../../svg";
// import { ProftecSvg } from '../../svg';
// import { UnielSvg } from '../../svg';
// import { VolpeVolanteSvg } from '../../svg';
// import { SupraSvg } from '../../svg';

import era from "../../images/era_m.png";
import grifon from "../../images/grifon.png";
import kosmos from "../../images/kosmos_m.png";
import prof from "../../images/profitec_m.png";
import supra from "../../images/supra_m.png";
import elect from "../../images/tdm-electric_m.png";
import unibob from "../../images/unibob_m.png";
import uniel from "../../images/uniel_m.png";
import volpe from "../../images/volpe-volante_m.png";
import BlockHeaderCustom from "../shared/BlockHeaderCustom";

function BlockBrandsImages(props) {
    return (
        <div className="brands">
            <div className="container">
                <BlockHeaderCustom title="Products" />
                {/* <GroupSvg /> */}
                <div className="row">
                    <div className="col-md-4 d-flex justify-content-center align-items-cente ">
                        <a className="m-auto" href="#">
                            <img src={era} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={grifon} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={kosmos} alt="" />{" "}
                        </a>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-cente">
                        <a className="m-auto" href="#">
                            <img src={prof} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={supra} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={elect} alt="" />{" "}
                        </a>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-cente">
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={unibob} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={uniel} alt="" />{" "}
                        </a>
                        <a className="m-auto" href="#">
                            {" "}
                            <img src={volpe} alt="" />{" "}
                        </a>
                    </div>
                </div>

                {/* <div><SupraSvg /></div>
                <div> <VolpeVolanteSvg /></div>
                <div><UnielSvg /></div>
                <div><ProftecSvg /></div> */}
            </div>
        </div>
    );
}

export default BlockBrandsImages;
