import React, { useState, useEffect } from "react";

const StepBar = (props) => {

    return (
        <section class="step-section">
            <div class="wrapper-container">
                <ul class="progress-wrap">
                    <li class="step active"><a class="icon created" href=""><img src="/asset/images/icons/c-1.svg" alt="" /></a><a class="icon disable" href=""> <img src="/asset/images/icons/d-1.svg" alt="" /></a><a class="icon finished" href=""><img src="/asset/images/icons/f-1.svg" alt="" /></a><a class="content" href="">
                        <p><b>Bước 1</b></p>
                        <p>Tạo chiến lược </p></a></li>
                    <li class="step"> <a class="icon created" href=""><img src="/asset/images/icons/c-2.svg" alt="" /></a><a class="icon disable" href=""> <img src="/asset/images/icons/d-2.svg" alt="" /></a><a class="icon finished" href=""><img src="/asset/images/icons/f-2.svg" alt="" /></a><a class="content" href="">
                        <p><b>Bước 2</b></p>
                        <p>Chọn nhóm Khách hàng</p></a></li>
                    <li class="step"> <a class="icon created" href=""><img src="/asset/images/icons/c-3.svg" alt="" /></a><a class="icon disable" href=""> <img src="/asset/images/icons/d-3.svg" alt="" /></a><a class="icon finished" href=""><img src="/asset/images/icons/f-3.svg" alt="" /></a><a class="content" href="">
                        <p><b>Bước 3</b></p>
                        <p>Chọn nhóm Giải thưởng</p></a></li>
                    <li class="step"> <a class="icon created" href=""><img src="/asset/images/icons/c-4.svg" alt="" /></a><a class="icon disable" href=""> <img src="/asset/images/icons/d-4.svg" alt="" /></a><a class="icon finished" href=""><img src="/asset/images/icons/f-4.svg" alt="" /></a><a class="content" href="">
                        <p><b>Bước 4</b></p>
                        <p>Chọn giao diện vòng quay</p></a></li>
                </ul>
            </div>
        </section>

    );
}
export default StepBar;