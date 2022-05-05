import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const SelectBoxv2 = ({ optionLabel, optionValue, value, options, onChange, ...props }) => {
    useEffect(() => {
        $('#selectv2').append('<button id="clear_addon">Clear</button>');
    }, [])
    return (
        <>
            <select class="form-control" id="selectv2" onChange={(e) => {
                if (onChange) {
                    onChange(e.target?.value ?? null)
                }
            }} {...props}>
                {
                    [{ [optionValue]: null, [optionLabel]: "Lựa chọn" }, ...options]?.map((item, i) => {
                        return (
                            <option selected={item[optionValue] === value} value={item[optionValue]}>{item[optionLabel]}</option>
                        )
                    })
                }

            </select>
        </>
    );
};

SelectBoxv2.propTypes = {

};

SelectBoxv2.defaultProps = {

};

export default React.memo(SelectBoxv2);
