import { ROOT, LOGIN, ROLEPAGE, DASHBOARD, LOGSPIN, WHEEL_SPIN, PROXY_ALLOCATION_GROUP, CHANNEL_SPIN, EXAMPLE_PAGE, STRATEGY_SPIN } from "../utils/constant"
// import NavBarMain from "../shared/packages/layout/nav/style_HDBank/nav-main"
// import NavBarMainOtherStyle from "../shared/packages/layout/nav/other_Style/nav-main"
import NavBarStyle360 from "../shared/packages/layout/nav/styleHDBank_otp/nav-main"
import IconCustomize, { ICON_CODE } from "../shared/packages/control/icon"
import { TYPELAYOUT } from "../shared/packages/globalConstant/common"

export const masterConfig = {
    type: TYPELAYOUT.WEB_APP,
    logo: 'https://hdbank.com.vn/asset/images/logo-en.svg',
    themeNavbar: <NavBarStyle360 />,
    menu: [
        {
            icon: <IconCustomize code={ICON_CODE.HOME} />,
            title: 'menuhome',
            to: ROOT,
            items: []
        },
        // {
        //     icon: <IconCustomize code={ICON_CODE.DASHBOARD} />,
        //     title: "Component",
        //     items: [
        //         {
        //             icon: <IconCustomize code={ICON_CODE.LOGIN} />,
        //             title: "Page Example",
        //             menuLevel: 2,
        //             items: [
        //                 {
        //                     icon: <IconCustomize code={ICON_CODE.LOGIN} />,
        //                     menuLevel: 3,
        //                     title: "Redux",
        //                     auth: true,
        //                     to: EXAMPLE_PAGE
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
            icon: <IconCustomize code={ICON_CODE.DASHBOARD} />,
            title: "Quản lý vòng quay",
            items: [
                {
                    icon: <IconCustomize code={ICON_CODE.LOGIN} />,
                    title: "Chiến lược",
                    menuLevel: 2,
                    auth: true,
                    to: STRATEGY_SPIN
                },
                {
                    icon: <IconCustomize code={ICON_CODE.LOGIN} />,
                    title: "Tập khách hàng",
                    menuLevel: 2,
                    auth: true,
                    to: PROXY_ALLOCATION_GROUP
                },
                {
                    icon: <IconCustomize code={ICON_CODE.LOGIN} />,
                    title: "Giao diện & giải thưởng",
                    menuLevel: 2,
                    auth: true,
                    to: WHEEL_SPIN
                },
                {
                    icon: <IconCustomize code={ICON_CODE.LOGIN} />,
                    title: "Lịch sử vòng quay",
                    menuLevel: 2,
                    auth: true,
                    to: LOGSPIN
                }
            ]
        },
    ],
    //https://github.com/stephenway/react-flagkit/blob/master/src/countryCodes.ts
    language: [
        {
            code: 'GB',
            eventCode: 'en',
            default: true,
            text: 'English'
        },
        {
            code: 'VN',
            eventCode: 'vn',
            text: 'Tiếng Việt'
        }
    ]
}