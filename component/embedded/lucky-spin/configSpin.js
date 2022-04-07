import React, { useEffect, useState } from "react";
import { channel_spin, category_client, group_allocation, category_wheel, theme_instance, type_allocation } from "./data/masterData"
import Select from 'react-select';
import { enum_master_type } from "./data/enum"

const ConfigSpinComponent = (props) => {

    const [selected, setSelected] = useState({
        channel: null,
        categoryClient: null,
        allocation: null,
        wheel_config: null,
        theme: null
    })

    const handleChange = (selectedOption, e) => {
        selected.channel = { ...selectedOption };
        selected.allocation = null;
        selected.categoryClient = null;
        setSelected({ ...selected })
    };

    const handleChangeCategory = (selectedOption, e) => {
        selected.allocation = null;
        selected.categoryClient = { ...selectedOption };
        setSelected({ ...selected })
    };

    const handleChangeAllocation = (selectedOption, e) => {
        selected.allocation = { ...selectedOption };
        setSelected({ ...selected })
    };

    const handleChangeWheelConfig = (selectedOption, e) => {
        selected.wheel_config = { ...selectedOption };
        setSelected({ ...selected })
    };

    const handleChangeTheme = (selectedOption, e) => {
        selected.theme = { ...selectedOption };
        setSelected({ ...selected })
    };

    return (
        <div class="panel_luckySpin" id="fade">
            <div class="panel__content">
                {/* <a className="btn btn-danger" style={{ marginLeft: '50%' }} id="close_modal" href="">Đóng</a> */}
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <span><b>Tên chiến lược</b></span>
                        <input className="inputstyle" type="text"></input>
                    </div>
                    <div className="col-md-12">
                        <div className="title_box"><b>Chọn channel</b></div>
                        <div className="boxform">
                            <Select
                                key={'currency'}
                                value={selected.channel}
                                className="form-control"
                                name="currency"
                                onChange={handleChange}
                                options={channel_spin.map(x => ({ ...x, label: x.channel_name, value: x.id }))}
                                placeholder={"Chọn"}
                                instanceId="select-currency"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="title_box"><b>Chọn danh mục KH</b></div>
                        <div className="boxform">
                            <Select
                                key={'currency2'}
                                value={selected.categoryClient}
                                className="form-control"
                                name="currency"
                                onChange={handleChangeCategory}
                                options={category_client?.map(x => ({ ...x, label: x.name, value: x.id })) ?? []}
                                placeholder={"Chọn"}
                                instanceId="select-currency2"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="title_box"><b>Chọn nhóm phân bổ</b></div>
                        <div className="boxform">
                            <Select
                                key={'currency2'}
                                value={selected.allocation}
                                className="form-control"
                                name="currency"
                                onChange={handleChangeAllocation}
                                options={group_allocation?.filter(x => x.category_client_id === selected.categoryClient?.id)?.map(x => ({ ...x, label: x.type, value: x.id })) ?? []}
                                placeholder={"Chọn"}
                                instanceId="select-currency2"
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        {
                            selected.allocation &&
                            <>
                                <div className="title_box"><b>Phân bổ</b></div>
                                <div className="boxform">
                                    {
                                        type_allocation.map(x => ({ ...x, label: x.name, value: x.id }))?.map((item, index) => {
                                            return (
                                                <>
                                                    <input type="radio" id="html" name="fav_language" checked={selected.allocation?.object?.id === type_allocation[index]?.id} value={type_allocation[index]?.id} />
                                                    <label for="html">&nbsp;{type_allocation[index]?.name}</label><br />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                    </div>
                    <div className="col-md-6">
                        {
                            selected.allocation &&
                            <>
                                <div className="title_box"><b>Danh sách Phân bổ</b></div>
                                <div className="boxform">
                                    <table className="table table-border">
                                        <tr>
                                            <th>Master id</th>
                                            <th>Master code</th>
                                        </tr>
                                        {
                                            selected.allocation?.data?.map(item => {
                                                return (
                                                    <tr>
                                                        <td>{item?.master_id}</td>
                                                        <td>{item?.master_code}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="title_box"><b>Chọn kiểu vòng quay</b></div>
                        <div className="boxform">
                            <Select
                                key={'currency2'}
                                value={selected.wheel_config}
                                className="form-control"
                                name="currency"
                                onChange={handleChangeWheelConfig}
                                options={category_wheel.map(x => ({ ...x, label: x.name, value: x.id })) ?? []}
                                placeholder={"Chọn"}
                                instanceId="select-currency2"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="title_box"><b>Chọn chủ đề</b></div>
                        <div className="boxform">
                            <Select
                                key={'currency2'}
                                value={selected.theme}
                                className="form-control"
                                name="currency"
                                onChange={handleChangeTheme}
                                options={theme_instance.map(x => ({ ...x, label: x.name, value: x.id })) ?? []}
                                placeholder={"Chọn"}
                                instanceId="select-currency2"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    {/* button export */}
                    <div className="col-md-1">
                        <button className="btn_luckyspin pw1" style={{ width: '150px' }} onClick={() => {
                            props.devMode(true)
                            if (selected.wheel_config && selected.theme) {
                                props.export(selected);
                            }
                        }}>
                            <p>
                                Wheel Editor
                            </p>
                        </button>
                    </div>
                    <div className="col-md-1">
                        <button className="btn_luckyspin pw2" style={{ width: '200px' }} onClick={() => {
                            if (selected.wheel_config && selected.theme) {
                                props.export(selected);
                            }
                            else {
                                swal(
                                    "Lỗi",
                                    "Không thể xuất bản vì thiếu thiết lập",
                                    "error"
                                );
                            }
                        }}>
                            <p>
                                Xuất bản vòng quay
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfigSpinComponent;
