import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"

const GroupAllocation = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    return (
        <section class="choice-customer">
            <div class="wrapper-container">
                <div class="wrap-sort d-flex align-items-center">
                    <h1 class="title-small">Nhóm Khách hàng</h1>
                    <SelectBoxv2
                        id="selectbox"
                        style={{ width: "353px", marginLeft: "16px" }}
                        optionLabel="objectName"
                        optionValue="id"
                        onChange={(data) => {
                        }}
                        value={null}
                        options={[]}
                    />
                    <a class="edit ms-3" href=""> <img src="/asset/images/icons/pencle.svg" alt="" /></a>
                    <a class="save ms-3" href=""> <img src="/asset/images/icons/save.svg" alt="" style={{ display: "none" }} /></a>
                </div>
                <div class="wrap-body">
                    <div class="wrap-body_header d-flex align-items-center justify-content-between">
                        <h1 class="title-small">Danh sách Khách hàng</h1>
                        <div class="wrap-button d-flex align-items-center">
                            <button class="btn btn-search"> <img src="/asset/images/icons/search.svg" alt="" /></button>
                            <button class="btn btn-add"><img src="/asset/images/icons/add.svg" alt="" /><span>&nbsp;Thêm mới</span></button>
                            <button class="btn btn-upload" type="submit"> <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>&nbsp;Tải lên</span></button>
                            <button class="btn btn-setting" type="submit" data-fancybox="" data-src="#dialog-content"> <img src="/asset/images/icons/setting.svg" alt="" /><span>&nbsp;Cấu hình chung</span></button>
                        </div>
                    </div>
                    <div class="wrap-body_table">
                        <table>
                            <tr>
                                <th>
                                    <div class="sort">
                                        <p>Tên Khách hàng</p><img src="/asset/images/icons/sort.svg" alt="" />
                                    </div>
                                </th>
                                <th>
                                    <p>Mã Khách hàng</p>
                                </th>
                                <th>
                                    <p>Số lượt quay</p>
                                </th>
                                <th>
                                    <p>Vô hiệu hóa</p>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <p>Nguyễn Ngọc Yến Nhi</p>
                                </td>
                                <td>
                                    <p>123456</p>
                                </td>
                                <td>
                                    <p>2</p>
                                </td>
                                <td>
                                    <div class="custom-select">
                                        <select class="form-control" name="">
                                            <option value="0" disable hidden selected>True</option>
                                            <option value="1">True</option>
                                            <option value="2">False</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Nguyễn Ngọc Yến Nhi</p>
                                </td>
                                <td>
                                    <p>123456</p>
                                </td>
                                <td>
                                    <p>2</p>
                                </td>
                                <td>
                                    <div class="custom-select">
                                        <select class="form-control" name="">
                                            <option value="0" disable hidden selected>True</option>
                                            <option value="1">True</option>
                                            <option value="2">False</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Nguyễn Ngọc Yến Nhi</p>
                                </td>
                                <td>
                                    <p>123456</p>
                                </td>
                                <td>
                                    <p>2</p>
                                </td>
                                <td>
                                    <div class="custom-select">
                                        <select class="form-control" name="">
                                            <option value="0" disable hidden selected>True</option>
                                            <option value="1">True</option>
                                            <option value="2">False</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Nguyễn Ngọc Yến Nhi</p>
                                </td>
                                <td>
                                    <p>123456</p>
                                </td>
                                <td>
                                    <p>2</p>
                                </td>
                                <td>
                                    <div class="custom-select">
                                        <select class="form-control" name="">
                                            <option value="0" disable hidden selected>True</option>
                                            <option value="1">True</option>
                                            <option value="2">False</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <nav class="pagination-nav d-flex align-items-center">
                            <ul class="pagination d-flex align-items-center ms-auto">
                                <li class="page-item"><a class="page-link" href="#"><em class="material-icons">navigate_before</em></a></li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item"><a class="page-link" href="#"><em class="material-icons">navigate_next</em></a></li>
                            </ul>
                        </nav>
                        <div class="wrap-button d-flex align-items-center">
                            <button class="btn btn-backstep" onClick={() => {
                                material?.updateStepValue(1);
                            }} type="button">
                                <img src="/asset/images/icons/back.svg" alt="" /><span>Quay lại</span></button>
                            <button class="btn btn-submit" type="button"> <span>Tiếp tục tạo chiến lược</span><em class="material-icons">arrow_forward</em></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default GroupAllocation;