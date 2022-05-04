import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const SelectBoxv2 = ({ optionLabel, optionValue, value, options, onChange, ...props }) => {
    return (
        <select class="form-control" onChange={(e) => {
            if (onChange) {
                onChange(e.target?.value ?? null)
            }
        }} {...props}>
            {
                options?.map((item, i) => {
                    return (
                        <option selected={item[optionValue] === value} value={item[optionValue]}>{item[optionLabel]}</option>
                    )
                })
            }
        </select>
    );
};

SelectBoxv2.propTypes = {

};

SelectBoxv2.defaultProps = {

};

export default React.memo(SelectBoxv2);
