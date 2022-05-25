// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';

// application
import Menu from './Menu';
import { ArrowRoundedRight6x9Svg } from '../../svg';

import { useDispatch, useSelector } from 'react-redux'



function DepartmentsLinks(props) {
    const selectedData = useSelector(state => state.locale)
    const dispatch = useDispatch()
    const linksList = props.dep.map((department, index) => {
        let arrow = null;
        let submenu = null;
        let itemClass = '';
        if (department.children && department.children.length > 0) {
            arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        }

        if (department.children && department.children.length > 0) {
            itemClass = 'departments__item--menu';
            submenu = (
                <div className="departments__menu">
                    <Menu items={department.children} onClick={props.func} />
                </div>
            );
        }

        return (
            <li key={index} className={`departments__item ${itemClass}`}>
                <Link to={`/catalog/${department.slug}`} onClick={props.func}>
                    {department.name}
                    {arrow}
                </Link>
                {submenu}
            </li>
        );
    });

    return (
        <ul className="departments__links">
            {linksList}
        </ul>
    );
}

export default DepartmentsLinks;
