// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { Check9x7Svg } from '../../svg';

function FilterCheck(props) {
    const { data, value, onChangeValue, filterValues } = props;

    const updateValue = (data, newValue, remove,code) => {

        onChangeValue({ filter: code, value: newValue, remove: remove });
    };

    const handleChange = (event, value,code) => {
        if (event.target.checked) {
            updateValue(value, [event.target.value], false,code);
        }
        if (!event.target.checked) {
            updateValue(value, event.target.value, true,code);
        }
    };

    let fillVal;
    if (filterValues[value] !== undefined) {
        fillVal = filterValues[value].split(",");
    }

    const itemsList = data.map((item) => {
        const itemClasses = classNames('filter-list__item', {
            'filter-list__item--disabled': item.count === 0,
        });

        return (
            <label key={item.slug} className={itemClasses}>
                <div className="filter-list__input input-check">
                    <span className="filter-list__title">{item.label}</span>
                    <span className="input-check__body">
                        <input
                            className="input-check__input"
                            type="checkbox"
                            value={item.id}
                            checked={filterValues && filterValues[value.code]  ? filterValues[value.code].toString().includes(item.id) : ''}
                            disabled={item.count === 0}
                            onChange={(e)=>handleChange(e,item.id,value.code)}
                        />
                        <span className="input-check__box" />
                        <Check9x7Svg className="input-check__icon" />
                    </span>
                </div>
            </label>
        );
    });

    return (
        <div className="filter-list">
            <div className="widget__title mt-5">
                {props.title}
            </div>
            <div className="filter-list__list">
                {itemsList}
            </div>
        </div>
    );
}

FilterCheck.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
    /**
     * Value.
     */
    value: PropTypes.arrayOf(PropTypes.string),
    /**
     * Change value callback.
     */
    onChangeValue: PropTypes.func,
};

export default FilterCheck;
