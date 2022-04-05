import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isNotNullAndUndefined } from "../../utils/objectHelper"
import { useTranslation } from "react-i18next";
import { InputControl } from "../input/inputControl"
import SelectBox from "../selectBox/selectBox"

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
            case 'boolean': return 'boolean';
            default: return "text";
        }
    }

    const convertDataType = (type, data) => {
        switch (type) {
            case 'number': return Number.parseInt(data);
            case 'boolean': return data === "true" ? true : false;
            default: return data;
        }
    }


    const supportBuilderTypeControl = (item) => {
        if (["text", "number"].includes(item.type)) {
            return <InputControl type={item.type} id={item.key} onChange={(e) => {
                const value = convertDataType(item?.type, e.target.value) ?? null;
                item.value = value;
                modelChange(indexData, item.key, item.value)
            }} defaultValue={item.value} />
        }
        if (["boolean"].includes(item.type)) {
            return <SelectBox id="selectbox"
                optionLabel="label"
                optionValue="value"
                onChange={(data) => {
                    item.value = data;
                    modelChange(indexData, item.key, item.value)
                }}
                value={item.value}
                isPortal
                options={[{ label: "True", value: true }, { label: "False", value: false }]}
            />
        }
        else return null;
    }

    return (
        <div className="row">
            {
                propConvert?.map((item, index) => {
                    return (
                        <div className="col-md-6">
                            <span>{item?.label}</span>
                            {
                                supportBuilderTypeControl(item)
                            }
                        </div>
                    )
                })
            }
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
