import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import mobileDetectHOC from "../../../shared/packages/hocs/mobileDetect"
import Modal from "../../../shared/packages/control/modal/index";

const EditorSpinComponent = (props) => {
    const { master_config_data, editor_config_apply, devMode } = props;
    const [object_copy, setObjectCopy] = useState(null);
    const [setting, setSetting] = useState({
        minimize: false,
        pin: true
    })

    useEffect(() => {
        console.log({ master_config_data });
        setObjectCopy({ ...master_config_data })
    }, [master_config_data])

    const updateKeyObject = (key, value) => {
        // select object to get updated
        let obj = object_copy;
        // get array of nested keys
        let nestedKeys = key.split('.');
        // get object from nested keys until last key
        // used slice(0, -1) so it will iterate through all key except last one
        nestedKeys.slice(0, -1).forEach(k => obj = obj[k]);
        // use object with last key and update value
        obj[nestedKeys[nestedKeys.length - 1]] = value
        setObjectCopy({ ...object_copy })
    }

    //update prize editor
    const updatePrizeObject = (index, key, value) => {
        // select object to get updated
        let obj = object_copy?.prizes;
        obj[index][key] = value;
        setObjectCopy({ ...object_copy })
    }


    const detectLayout = (child) => {
        return props?.isMobile ?
            <>
                {child}
            </>
            :
            <>
                <Draggable cancel={setting.pin ? ".layout_editor_spin" : ""}>
                    {child}
                </Draggable>
            </>
    }

    const [settingModal, setSettingModal] = useState({
        isOpen: false,
    })

    return (
        <>
            {
                detectLayout(
                    <div className="layout_editor_spin" id="layout_editor_spin">
                        <div className="row mt-1">
                            <div className="title_box center">
                                <button class="btn_luckyspin center pw2"
                                    onClick={() => {
                                        var layoutInstance = document.getElementById("layout_editor_spin");
                                        if (setting.minimize) {
                                            layoutInstance.style.height = "80vh";
                                        }
                                        else {
                                            layoutInstance.style.height = "60px";
                                        }
                                        setting.minimize = !setting.minimize;
                                        setSetting({ ...setting })
                                    }}>
                                    <b>
                                        {
                                            setting.minimize ? "Mở rộng" : "Thu nhỏ"
                                        }
                                    </b>
                                </button>
                                <button class="btn_luckyspin center pw1"
                                    onClick={() => {
                                        setting.pin = !setting.pin;
                                        setSetting({ ...setting })
                                    }}>
                                    <b>
                                        {
                                            setting.pin ? "Bỏ ghim" : "Ghim"
                                        }
                                    </b>
                                </button>
                                <button class="btn_luckyspin center"
                                    onClick={() => {
                                        console.log({ object_copy });
                                        editor_config_apply(object_copy)
                                    }}>
                                    Publish
                                </button>
                                <button class="btn_luckyspin center pw1"
                                    onClick={() => {
                                        devMode(false)
                                    }}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                        <div className="body_layout" style={{ display: setting.minimize ? 'none' : 'block' }}>
                            <hr />
                            <div className="row mt-1">
                                <div className="col-md-12">
                                    <span>Ảnh vòng quay</span>
                                    <input className="inputstyle" value={object_copy?.wheel_bg} onChange={(e) => {
                                        updateKeyObject('wheel_bg', e.target?.value)
                                    }} type="text"></input>
                                </div>
                                <div className="col-md-12 mt-1">
                                    <p style={{ textAlign: 'center' }}>Size vòng quay</p>
                                    <div className="row mt-1">
                                        <div className="col-md-6">
                                            <span>Rộng</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.width} onChange={(e) => {
                                                updateKeyObject('canvas.width', Number.parseInt(e.target?.value))
                                            }} type="number"></input>
                                        </div>
                                        <div className="col-md-6">
                                            <span>Cao</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.height} onChange={(e) => {
                                                updateKeyObject('canvas.height', Number.parseInt(e.target?.value))
                                            }} type="number"></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 mt-1">
                                    <p style={{ textAlign: 'center' }}>Margin vòng quay</p>
                                    <div className="row mt-1">
                                        <div className="col-md-3">
                                            <span>Trên</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.margin?.top} onChange={(e) => {
                                                updateKeyObject('canvas.margin.top', e.target?.value)
                                            }} type="number"></input>
                                        </div>
                                        <div className="col-md-3">
                                            <span>Trái</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.margin?.left} onChange={(e) => {
                                                updateKeyObject('canvas.margin.left', e.target?.value)
                                            }} type="number"></input>
                                        </div>
                                        <div className="col-md-3">
                                            <span>Phải</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.margin?.right} onChange={(e) => {
                                                updateKeyObject('canvas.margin.right', e.target?.value)
                                            }} type="number"></input>
                                        </div>
                                        <div className="col-md-3">
                                            <span>Dưới</span>
                                            <input className="inputstyle" value={object_copy?.canvas?.margin?.bottom} onChange={(e) => {
                                                updateKeyObject('canvas.margin.bottom', e.target?.value)
                                            }} type="number"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <span>Bán kính ngoài</span>
                                    <input className="inputstyle" value={object_copy?.object?.outerRadius} onChange={(e) => {
                                        updateKeyObject('object.outerRadius', e.target?.value)
                                    }} type="number"></input>
                                </div>
                                <div className="col-md-6">
                                    <span>Bán kính trong</span>
                                    <input className="inputstyle" value={object_copy?.object?.innerRadius} onChange={(e) => {
                                        updateKeyObject('object.innerRadius', e.target?.value)
                                    }} type="number"></input>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <span>Chỉnh lệch vòng quay</span>
                                    <input className="inputstyle" value={object_copy?.object?.rotationAngle} onChange={(e) => {
                                        updateKeyObject('object.rotationAngle', Number.parseFloat(e.target?.value))
                                    }} type="number" step={"0.1"}></input>
                                </div>
                                <div className="col-md-6">
                                    <span>Power vòng quay</span>
                                    <input className="inputstyle" value={object_copy?.animation?.spins} onChange={(e) => {
                                        updateKeyObject('animation.spins', Number.parseInt(e.target?.value))
                                    }} type="number" />
                                </div>
                            </div>
                            <hr />
                            <div className="row mt-1">
                                <div className="col-md-5">
                                    <span>Pointer external</span>
                                    <div class="form-check">
                                        <input type="checkbox" className="checkbox_spin" checked={object_copy?.canvas?.pointerExtenal?.isUse}
                                            onClick={(e) => {
                                                updateKeyObject('canvas.pointerExtenal.isUse', e.target.checked)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <span>Ảnh Pointer</span>
                                    <input className="inputstyle" value={object_copy?.canvas?.pointerExtenal?.url} onChange={(e) => {
                                        updateKeyObject('canvas.pointerExtenal.url', e.target?.value)
                                    }} type="text"></input>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <span>Postion X</span>
                                    <input className="inputstyle" value={object_copy?.canvas?.pointerExtenal?.translateX} onChange={(e) => {
                                        updateKeyObject('canvas.pointerExtenal.translateX', Number.parseFloat(e.target?.value))
                                    }} type="number"></input>
                                </div>
                                <div className="col-md-4">
                                    <span>Postion Y</span>
                                    <input className="inputstyle" value={object_copy?.canvas?.pointerExtenal?.translateY} onChange={(e) => {
                                        updateKeyObject('canvas.pointerExtenal.translateY', Number.parseFloat(e.target?.value))
                                    }} type="number"></input>
                                </div>
                                <div className="col-md-4">
                                    <span>Rotate</span>
                                    <input className="inputstyle" value={object_copy?.canvas?.pointerExtenal?.rotate} onChange={(e) => {
                                        updateKeyObject('canvas.pointerExtenal.rotate', Number.parseFloat(e.target?.value))
                                    }} type="number"></input>
                                </div>
                            </div>
                            <hr />
                            <div className="row mt-1">
                                <div className="col-md-6">
                                    <span>Font size</span>
                                    <input className="inputstyle" value={object_copy?.object?.textFontSize} onChange={(e) => {
                                        updateKeyObject('object.textFontSize', e.target?.value)
                                    }} type="number"></input>
                                </div>
                                <div className="col-md-6">
                                    <span>Text margin</span>
                                    <input className="inputstyle" value={object_copy?.object?.textMargin} onChange={(e) => {
                                        updateKeyObject('object.textMargin', e.target?.value)
                                    }} type="number"></input>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <span>Text orientation</span>
                                    <input className="inputstyle" value={object_copy?.object?.textOrientation} onChange={(e) => {
                                        updateKeyObject('object.textOrientation', e.target?.value)
                                    }} type="text"></input>
                                </div>
                                <div className="col-md-4">
                                    <span>Text Alignment</span>
                                    <input className="inputstyle" value={object_copy?.object?.textAlignment} onChange={(e) => {
                                        updateKeyObject('object.textAlignment', e.target?.value)
                                    }} type="text"></input>
                                </div>
                                <div className="col-md-4">
                                    <span>Line width</span>
                                    <input className="inputstyle" value={object_copy?.object?.lineWidth} onChange={(e) => {
                                        updateKeyObject('object.lineWidth', e.target?.value)
                                    }} type="text"></input>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <span>Font Family</span>
                                    <input className="inputstyle" value={object_copy?.object?.textFontFamily} onChange={(e) => {
                                        updateKeyObject('object.textFontFamily', e.target?.value)
                                    }} type="text"></input>
                                </div>
                                <div className="col-md-3">
                                    <span>Width</span>
                                    <input className="inputstyle" value={object_copy?.object?.textLineWidth} onChange={(e) => {
                                        updateKeyObject('object.textLineWidth', Number.parseInt(e.target?.value))
                                    }} type="number"></input>
                                </div>
                                <div className="col-md-3">
                                    <span>Color</span>
                                    <input className="inputstyle" value={object_copy?.object?.textFillStyle} onChange={(e) => {
                                        updateKeyObject('object.textFillStyle', e.target?.value)
                                    }} type="text"></input>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <span>Ảnh giải thưởng</span>
                                    <div class="form-check">
                                        <input type="checkbox" className="checkbox_spin" checked={object_copy?.imageRender}
                                            onClick={(e) => {
                                                updateKeyObject('imageRender', e.target.checked)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <span>Giải thưởng</span>
                                    <button class="btn_luckyspin center pw2"
                                        onClick={() => {
                                            settingModal.isOpen = true;
                                            setSettingModal({ ...settingModal })
                                        }}>
                                        Editor
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </div>

                    </div>
                )
            }
            <Modal
                isOpen={settingModal.isOpen}
                modalName="role-modal"
                showOverlay={true}
                onClose={() => setSettingModal({ ...settingModal, isOpen: false })}
                title={"Prizing Editor"}
                size="xl"
                centered
            >
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <button class="btn_luckyspin center pw1"
                                onClick={() => {
                                    object_copy?.prizes?.push({
                                        id: null,
                                        position: object_copy.prizes?.length + 1,
                                        allow_prize: false,
                                        name: '',
                                        imgPrize: null,
                                        color: "#000000",
                                        percent: 0,
                                        quantity: null
                                    });
                                    setObjectCopy({ ...object_copy })
                                }}>
                                Thêm mới
                            </button>
                        </div>
                        <div className="col-md-12">
                            <table className="table table-border">
                                <tr>
                                    <th>Position</th>
                                    <th>Name</th>
                                    <th>Image Prize</th>
                                    <th>Color</th>
                                    <th>Stroke Color</th>
                                    <th>Text Color</th>
                                    <th>Text Font Size</th>
                                    {/* <th>Allow prize</th>
                                    <th>Percent</th>
                                    <th>Quantity</th> */}
                                    <th>Action</th>
                                </tr>
                                {
                                    object_copy?.prizes?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <input className="inputstyle" value={item?.position} onChange={(e) => {
                                                        updatePrizeObject(index, "position", Number.parseInt(e.target?.value))
                                                    }} type="number"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.name} onChange={(e) => {
                                                        updatePrizeObject(index, "name", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.imgPrize} onChange={(e) => {
                                                        updatePrizeObject(index, "imgPrize", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.color} onChange={(e) => {
                                                        updatePrizeObject(index, "color", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.strokeStyle} onChange={(e) => {
                                                        updatePrizeObject(index, "strokeStyle", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.textFillStyle} onChange={(e) => {
                                                        updatePrizeObject(index, "textFillStyle", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.textFontSize} onChange={(e) => {
                                                        updatePrizeObject(index, "textFontSize", e.target?.value)
                                                    }} type="text"></input>
                                                </td>
                                                {/* <td>
                                                    <input type="checkbox" className="checkbox_spin_table" checked={item?.allow_prize}
                                                        onClick={(e) => {
                                                            updatePrizeObject(index, "allow_prize", e.target?.checked)
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.percent} onChange={(e) => {
                                                        updatePrizeObject(index, "percent", Number.parseFloat(e.target?.value))
                                                    }} type="number"></input>
                                                </td>
                                                <td>
                                                    <input className="inputstyle" value={item?.quantity} onChange={(e) => {
                                                        updatePrizeObject(index, "quantity", Number.parseInt(e.target?.value))
                                                    }} type="number"></input>
                                                </td> */}
                                                <td>
                                                    <button class="btn_luckyspin center pw3"
                                                        onClick={() => {
                                                            object_copy.prizes?.splice(index, 1);
                                                            setObjectCopy({ ...object_copy })
                                                        }}>
                                                        Xoá
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-login" onClick={() => {
                        setSettingModal({ ...settingModal, isOpen: false })
                    }}>
                        <p>
                            Xác nhận
                        </p>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default mobileDetectHOC(EditorSpinComponent);
