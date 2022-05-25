// react
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'


import shopApi from "../../api/shop";
import { url } from '../../helper';
import Collapse from '../shared/Collapse';
import { ArrowRoundedDown12x7Svg } from '../../svg';

import classNames from 'classnames';
import FilterCheck from '../filters/FilterCheck';
import FilterRange from '../filters/FilterRange';
import { FormattedMessage } from 'react-intl';
import FilterColor from '../filters/FilterColor';

const CheckFilterHandler = {
    type: 'check',
    serialize: (value) => value.join(','),
    deserialize: (value) => (value ? value.split(',') : []),
    isDefaultValue: (filter, value) => value.length === 0,
    getDefaultValue: () => [],
};

function WidgetFilters(props) {
    const [maxPrice, setMaxPrice] = useState();
    const [filtersData, setFilters] = useState();
    const selectedData = useSelector(state => state.locale)
    const {
        stateFilters,
        dispatch,
        filters,
        values,
        title,
        offcanvas,
    } = props;

    useEffect(() => {
        setFilters(filters)
    }, [filters])

    const handleValueChange = useCallback(({ filter, value, remove }) => {
        if (remove) {
            dispatch({
                type: 'REMOVE_FILTER_VALUE',
                filter: filter,
                value: value
            });
        } else {
            dispatch({
                type: 'SET_FILTER_VALUE',
                filter: filter,
                value: value ? CheckFilterHandler.serialize(value) : ''
            });
        }

    }, [dispatch]);

    const handleResetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    const classes = classNames('widget-filters widget', {
        'widget-filters--offcanvas--always': offcanvas === 'always',
        'widget-filters--offcanvas--mobile': offcanvas === 'mobile',
    });



    const filtersList =
        <>
            {filtersData ? filtersData.map((item) => (
                item.code != 'color' ?
                    <div className={classes}>
                        <div className="widget-filters__list">
                            <FilterCheck
                                filterValues={values}
                                // checked={chekedValue}
                                data={item.options}
                                value={item}
                                onChangeValue={handleValueChange}
                                title={item.name}
                            />
                        </div>
                    </div> : ''
            )) : ''

            }
        </>
    const filtersColor = filtersData && filtersData.map((item) => {
        return (
            item.code == 'color' &&
            <div className={classes}>
                <div className="widget-filters__list">
                    <FilterColor
                        filterValues={values}
                        // checked={chekedValue}
                        data={item.options}
                        value={item}
                        onChangeValue={handleValueChange}
                        title={item.name}
                    />
                </div>
            </div>
        )
    })



    return (
        <>
            {filtersList}
            {filtersColor}
            <div className={classes}>
                <div className="widget-filters__list">
                    <FilterRange
                        key={"Max Price"}
                        data={{ min: 0, max: parseInt(maxPrice) }}
                        value={stateFilters.filters.price !== undefined ? stateFilters.filters.price.split(',') : ''}
                        onChangeValue={handleValueChange}
                        title={'Գին'}
                    />
                </div>
                <div className="widget-filters__actions d-flex mb-n2">
                    <button
                        type="button"
                        className="btn btn-secondary f15 btn-lg"
                        onClick={handleResetFilters}
                    >
                        <FormattedMessage id="filter-reset" defaultMessage="Reset" />
                    </button>
                </div>
            </div>
            {/* <div className="widget-filters__actions d-flex mb-n2">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleResetFilters}
                    >
                       <FormattedMessage id="reset" defaultMessage="Վերականգնել" />
                    </button>
                </div> */}
        </>
    );
}


WidgetFilters.defaultProps = {
    offcanvas: 'mobile',
};

export default WidgetFilters;
