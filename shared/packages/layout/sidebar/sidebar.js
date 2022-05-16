import React, { useState, useEffect } from "react";
import DynamicLink from "../../../../component/common/DynamicLink/DynamicLink";

const SideBarComponent = (props) => {

    const menu = [
        {
            href: "/",
            as: '/',
            icon: '/asset/images/icons/side-2.svg',
            name: 'Chiến lược'
        },
        {
            href: "/customer",
            as: '/customer',
            icon: '/asset/images/icons/side-3.svg',
            name: 'Nhóm khách hàng'
        },
        {
            href: "/prizing",
            as: '/prizing',
            icon: '/asset/images/icons/side-4.svg',
            name: 'Nhóm giải thưởng'
        },
        {
            href: "/logSpin",
            as: '/logSpin',
            icon: '/asset/images/icons/side-5.svg',
            name: 'Lịch sử Chiến lược'
        },
        // {
        //     href: "/strategySpin",
        //     as: '/strategySpin',
        //     icon: '/asset/images/icons/side-2.svg',
        //     name: 'Chiến lược cũ'
        // },
        // {
        //     href: "/proxyAllocationGroup",
        //     as: '/proxyAllocationGroup',
        //     icon: '/asset/images/icons/side-2.svg',
        //     name: 'Nhóm khách hàng cũ'
        // },
        // {
        //     href: "/wheelSpin",
        //     as: '/wheelSpin',
        //     icon: '/asset/images/icons/side-2.svg',
        //     name: 'Giao diện & giải thưởng cũ'
        // },
        // {
        //     href: "/logSpin",
        //     as: '/logSpin',
        //     icon: '/asset/images/icons/side-2.svg',
        //     name: 'Lịch sử Chiến lược cũ'
        // }
    ]

    return (
        <div class="sidebar">
            <ul class="side-nav">
                {
                    menu?.map((item, idx) => {
                        return (
                            <li class={`side-item ${idx === 0 ? ' active' : ''}`}>
                                <DynamicLink href={item.href} as={item?.as}>
                                    <a>
                                        <img class="icon" src={item?.icon} alt="" />
                                        <span>{item?.name}</span>
                                    </a>
                                </DynamicLink>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}
export default SideBarComponent;