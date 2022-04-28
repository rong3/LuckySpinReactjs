import React, { useState, useEffect } from "react";
import DynamicLink from "../../../common/DynamicLink/DynamicLink";
import StepBar from "../../../common/StepBar/StepBar"
import { useRouter } from 'next/router'

const StrategyContainer = (props) => {
    const router = useRouter()
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    return (
        <>
            <StepBar {...props} />
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
                                        <select class="form-control" name="">
                                            <option value="">Lựa chọn loại chiến lược</option>
                                            <option value="">Ngoài hệ thống</option>
                                            <option value="">Trong hệ thống</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-lg-12">
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
                                        <button class="btn btn-submit" type="button"> <span>Tiếp tục tạo chiến lược</span><em class="material-icons">arrow_forward</em></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default StrategyContainer;