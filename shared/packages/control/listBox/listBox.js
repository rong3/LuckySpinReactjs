import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

const ListBoxComponent = ({ options, title, onClickItem, onUpdate, onDelete, defaultValue, value, ...props }) => {
    const { t } = useTranslation('common');
    const [selected, setSelected] = useState(null)
    const onClickItemInternal = (item) => {
        setSelected(item)
        onClickItem(item);
    }
    useEffect(() => {
        if (value) {
            setSelected({ ...value })
        }
        else {
            setSelected({ ...defaultValue })
        }
    }, [defaultValue, value])

    const isActive = (item) => {
        return selected?.value === item?.value;
    }

    return (
        <div className='list-box-custom'>
            <div className='search-range'>
                <div className='title'>
                    {title}
                </div>
            </div>
            <div className='wrapper-item'>
                {
                    options?.map((item, index) => {
                        return (
                            <div className={`item${isActive(item) ? ' active' : ''}`}
                                onClick={(e) => {
                                    onClickItemInternal(item)
                                }}>
                                {item?.label}
                                {
                                    isActive(item) &&
                                    <div className='operation'>
                                        {
                                            onUpdate &&
                                            <em className='fas fa-edit action' onClick={(e) => {
                                                if (onUpdate)
                                                    onUpdate(item)
                                            }} >
                                            </em>
                                        }
                                        {
                                            onDelete &&
                                            <em className='fas fa-trash action' onClick={(e) => {
                                                if (onDelete)
                                                    onDelete(item)
                                            }} >
                                            </em>
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

ListBoxComponent.propTypes = {
    options: PropTypes.array,
    title: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    onClickItem: PropTypes.func
};

ListBoxComponent.defaultProps = {
    options: [],
};

export default React.memo(ListBoxComponent);
