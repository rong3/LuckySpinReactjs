import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";

const BackGroundUI = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    return (
        <div class="tab-container">
            <div class="swiper mySwiper layout-bg">
                <div class="swiper-header d-flex align-items-center">
                    <h1>Chọn hình ảnh vòng quay</h1>
                    <button class="btn btn-default" type="submit"> <img src="/asset/images/icons/cloud-upload-2.svg" alt="" /><span>Tải lên</span></button>
                    <div class="swiper__arrows">
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                </div>
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a data-fancybox-trigger="gallery"> <img src="/asset/images/bg-review-1.jpg" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a> <img src="/asset/images/bg-review-2.jpg" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a> <img src="/asset/images/bg-review-3.jpg" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a> <img src="/asset/images/bg-review-4.jpg" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a> <img src="/asset/images/bg-review-5.jpg" alt="" /></a></div>
                    </div>
                </div>
            </div>
        </div>
        // /* <div style="display: none;"><a href="/asset/images/bg-review-1.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-1.jpg"></a><a href="/asset/images/bg-review-2.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-2.jpg"></a><a href="/asset/images/bg-review-3.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-3.jpg"></a></div> */}
    )
}
export default BackGroundUI;