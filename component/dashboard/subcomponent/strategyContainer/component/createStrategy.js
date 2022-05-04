import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../shared/packages/control/selectBoxv2/selectBoxv2"

const CreateStrategy = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();

    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    const { masterObjectAllocationList } = useSelector((state) => state.masterObjectAllocation);

    return (
        <section class="create-strategy">
            <div class="wrapper-container">
                <div class="row no-gutters">
                    <div class="wrap-left">
                        <h1 class="section-title">Hãy thiếp lập chiến lược <br />vòng quay may mắn</h1>
                        <p class="desc">
                            Thiết lập các thông số qua các bước thực hiện trên màn hình phù hợp với chiến lược vòng quay may mắn mà
                            bạn mong muốn
                        </p>
                        <figure> <img src="/asset/images/image_chienluoc.png" alt="" /></figure>
                    </div>
                    <div class="wrap-right">
                        <h2>Tạo chiến lược</h2>
                        <form class="wrap-form">
                            <div class="row">
                                <div class="form-group col-lg-6">
                                    <label for="">Tên chiến lược</label>
                                    <input class="form-control" type="text" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Loại chiến lược</label>
                                    <SelectBoxv2
                                        id="selectbox"
                                        optionLabel="objectName"
                                        optionValue="id"
                                        onChange={(data) => {
                                            console.log({ data });
                                        }}
                                        //  value="ad55572d-5776-41ae-3f83-08da1094d7d6"
                                        options={masterObjectAllocationList ?? []}
                                    />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Cấu hình lượt quay</label>
                                    <SelectBoxv2
                                        id="selectbox2"
                                        optionLabel="name"
                                        optionValue="id"
                                        onChange={(data) => {
                                            console.log({ data });
                                        }}
                                        //  value="ad55572d-5776-41ae-3f83-08da1094d7d6"
                                        options={material?.masterData?.quantitySpin ?? []}
                                    />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Cấu hình đường dẫn</label>
                                    <input class="form-control" type="text" placeholder="url" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Ngày bắt đầu</label>
                                    <input class="form-control" type="datetime-local" name="" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Ngày kết thúc</label>
                                    <input class="form-control" type="datetime-local" name="" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <input id="check" type="checkbox" name="" />
                                    <label class="check-label" for="check">Tỉ lệ quay trúng chia đều</label>
                                </div>
                                <div class="form-group col-lg-12">
                                    <button class="btn btn-backstep" onClick={() => {
                                        changeRoute('/')
                                    }} type="button"> <img src="/asset/images/icons/back.svg" alt="" /><span>Quay lại</span></button>
                                    <button class="btn btn-submit"
                                        onClick={() => material?.updateStepValue(2)}
                                        type="button"> <span>Tiếp tục tạo chiến lược</span><em class="material-icons">arrow_forward</em></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CreateStrategy;