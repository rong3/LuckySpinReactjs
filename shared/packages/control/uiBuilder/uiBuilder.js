import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isNotNullAndUndefined } from "../../utils/objectHelper"
import { useTranslation } from "react-i18next";
import { InputControl } from "../input/inputControl"

const UIBuilder = ({ objectKeys, modelChange, indexData, ...props }) => {
    const { t } = useTranslation('common');
    const [propConvert, setPropConvert] = useState([])

    useEffect(() => {
        if (objectKeys) {
            const convert = Object.keys(objectKeys).map((key) =>
            ({
                key: key,
                label: objectKeys[key]?.label,
                value: objectKeys[key]?.value,
                type: convertType(typeof objectKeys[key]?.value)
            }));
            setPropConvert([...convert]);
        }
    }, [objectKeys])

    useEffect(() => {

    }, [propConvert])

    const convertType = (type) => {
        switch (type) {
            case 'string': return 'text';
            case 'number': return 'number';
            default: return "text";
        }
    }

    const convertDataType = (type, data) => {
        switch (type) {
            case 'number': return Number.parseInt(data);
            default: return data;
        }
    }


    const supportBuilderTypeControl = (item) => {
        return <InputControl type={item.type} id={item.key} onChange={(e) => {
            const value = convertDataType(item?.type, e.target.value) ?? null;
            item.value = value;
            modelChange(indexData, item.key, item.value)
        }} defaultValue={item.value} />
    }

    return (
        <div className="row">
            <div className="col-md-6">
                {
                    propConvert?.map((item, index) => {
                        return (
                            <>
                                <span>{item?.label}</span>
                                {
                                    supportBuilderTypeControl(item)
                                }
                            </>
                        )
                    })
                }
            </div>
        </div>
    );
};

UIBuilder.propTypes = {
    objectKeys: PropTypes.any,
    modelChange: PropTypes.func,
    indexData: PropTypes.number
};

UIBuilder.defaultProps = {
    objectKeys: {},
    indexData: 0,
    modelChange: () => { }
};

export default React.memo(UIBuilder);
