import React from "react";
import { useRouter } from 'next/router'
import { map } from "jquery";

function DashBoardComponent(props) {
    const router = useRouter()
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    return (
        <section class="home-1">
            <div class="wrapper-container d-flex align-items">
                <div class="wrap-left">
                    <div class="wrap-left_header d-flex align-items justify-content-between">
                        <h1 class="section-title"><img src="/asset/images/icons/side-2.svg" alt="" />&nbsp; Chiến lược</h1>
                        <a class="btn-add" onClick={() => {
                            changeRoute('/strategySpin/container')
                        }}>
                            <em class="material-icons">add &nbsp;</em>
                            <span>Thêm mới</span>
                        </a>
                    </div>
                    <div class="wrap-left_body">
                        <ul>
                            <li>
                                <div class="title-item"> <a class="title" href="">Chiến lược Test</a></div>
                                <div class="action-item"> <a class="edit" href=""> <img src="/asset/images/icons/edit.svg" alt="" /></a><a class="delete" href=""> <img src="/asset/images/icons/trash.svg" alt="" /></a></div>
                            </li>
                            <li>
                                <div class="title-item"> <a class="title" href="">Nội bộ khách hàng</a></div>
                                <div class="action-item"> <a class="edit" href=""> <img src="/asset/images/icons/edit.svg" alt="" /></a><a class="delete" href=""> <img src="/asset/images/icons/trash.svg" alt="" /></a></div>
                            </li>
                            <li>
                                <div class="title-item"> <a class="title" href="">Chiến lược khách hàng 2</a></div>
                                <div class="action-item"> <a class="edit" href=""> <img src="/asset/images/icons/edit.svg" alt="" /></a><a class="delete" href=""> <img src="/asset/images/icons/trash.svg" alt="" /></a></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="wrap-right">
                    <div class="wrap-right_header"> <a href=""> <img src="/asset/images/circle-review.jpg" alt="" /></a></div>
                    <div class="wrap-right_body">
                        <ul>
                            <li>
                                <div class="title">
                                    <p>Tên chiến lược</p>
                                </div>
                                <div class="content">
                                    <p>Chiến lược test</p>
                                </div>
                            </li>
                            <li>
                                <div class="title">
                                    <p>Nhóm khách hàng</p>
                                </div>
                                <div class="content">
                                    <p>Nhóm KH 1</p>
                                </div>
                            </li>
                            <li>
                                <div class="title">
                                    <p>Nhóm giải thưởng</p>
                                </div>
                                <div class="content">
                                    <p>Nhóm giải ABC</p>
                                </div>
                            </li>
                            <li>
                                <div class="title">
                                    <p>Người tạo</p>
                                </div>
                                <div class="content">
                                    <p>Nguyễn Văn A</p>
                                </div>
                            </li>
                            <li>
                                <div class="title">
                                    <p>Ngày bắt đầu</p>
                                </div>
                                <div class="content">
                                    <p>28/03/2022 4:15:50 AM</p>
                                </div>
                            </li>
                            <li>
                                <div class="title">
                                    <p>Ngày kết thúc</p>
                                </div>
                                <div class="content">
                                    <p>28/03/2022 4:15:50 AM</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DashBoardComponent;