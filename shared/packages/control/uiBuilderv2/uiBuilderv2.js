import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isNotNullAndUndefined } from "../../utils/objectHelper"
import { useTranslation } from "react-i18next";
import { InputControl } from "../input/inputControl"
import SelectBox from "../selectBox/selectBox"

const UIBuilderv2 = ({ section, attribute, modelChange, indexData, ...props }) => {
    const { t } = useTranslation('common');
    const [propConvert, setPropConvert] = useState([])

    useEffect(() => {
        if (attribute) {
            const convert = Object.keys(attribute).map((key) =>
            ({
                key: key,
                label: attribute[key]?.label,
                value: attribute[key]?.value,
                type: convertType(typeof attribute[key]?.value),
                section: attribute[key]?.section,
                hide: attribute[key]?.hide,
                col: attribute[key]?.col
            }));
            setPropConvert([...convert]);
        }
    }, [attribute])

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
                modelChange(item.key, item.value)
            }} defaultValue={item.value} />
        }
        if (["boolean"].includes(item.type)) {
            return <SelectBox id="selectbox"
                optionLabel="label"
                optionValue="value"
                onChange={(data) => {
                    item.value = data;
                    modelChange(item.key, item.value)
                }}
                value={item.value}
                isPortal
                options={[{ label: "True", value: true }, { label: "False", value: false }]}
            />
        }
        else return null;
    }

    return (
        <form class="wrap-form">
            {
                Object.keys(section)?.map((parent, i) => {
                    const parentTag = section[parent];
                    return (
                        <div class="form-row row">
                            <p class="title">
                                {parentTag?.name}
                            </p>
                            {
                                propConvert?.filter(x => !x.hide && x?.section?.id === parentTag?.id)
                                    ?.map((child, j) => {
                                        return (
                                            <div key={j} class={`form-group col-lg-${child?.col}`}>
                                                <label for="">{child?.label}</label>
                                                {
                                                    supportBuilderTypeControl(child)
                                                }
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    )
                })
            }
        </form>
    );
};

UIBuilderv2.propTypes = {

};

UIBuilderv2.defaultProps = {

};

export default React.memo(UIBuilderv2);
