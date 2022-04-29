import React, { useState, useEffect } from 'react'
import { Typography, FormControl, Data, Button } from '@material-ui/core'
import { InputControl } from "../../../../shared/packages/control/input/inputControl"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import mobileDetectHOC from "../../../../shared/packages/hocs/mobileDetect"
import { usePermission } from "../../../../shared/packages/provider/accessGateway"
import withPermission from "../../../../shared/packages/hocs/permission/permissionHOC"
import DataGridControl from '../../../../shared/packages/control/grid/datagrid';
import { getLogSpin } from "../../../../services/logSpin.service"

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function LogSpinComponent(props) {
    const [allows] = usePermission();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [listLogSpin, setListLogSpin] = useState(null);

    const { classes } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        getLogSpin({ keySearch: 'all' }).then((res) => {
            const data = res?.data?.data ?? [];
            setListLogSpin([...data]);
        })
    }, [])

    function getProxyName(params) {
        if (params.field === 'masterName')
            return `${params?.row?.masterAllocationSelected?.masterId || ''}`;
        if (params.field === 'channelPrizeName')
            return `${params?.row?.proxyStrategyPrize?.channelPrize?.name || ''}`;
        if (params.field === 'strategySpinName')
            return `${params?.row?.proxyStrategyPrize?.strategySpin?.name || ''}`;
        else
            return '';
    }

    const columns = [
        {
            field: 'strategySpinName',
            headerName: 'Tên chiến lược',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getProxyName,
        },
        {
            field: 'masterName',
            headerName: 'Người trúng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getProxyName,
        },
        {
            field: 'channelPrizeName',
            headerName: 'Tên giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getProxyName,
        },

        {
            field: 'spinDate',
            headerName: 'Ngày trúng giải',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
    ]


    return (
        // <div className={classes.root}>
        //     <div className="content">
        //         <div className="block-content">
        //             <div className="row row-title mt-1">
        //                 <div className="col-md-12 table-height">
        //                     {
        //                         listLogSpin?.length &&
        //                         <DataGridControl
        //                             rows={listLogSpin}
        //                             columns={columns}
        //                             count={listLogSpin.length}
        //                             disableSelectionOnClick
        //                         />
        //                     }
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <body class="history">
            <header>

            </header>
            <main>
                <section class="history-section">
                    {/* <h1 class="section-title d-flex align-items-center"> <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />&nbsp; Lịch sử chiến lược</h1> */}
                    <div class="wrapper-container d-flex">
                        <div class="wrap-left">
                            <div class="wrap-left_header d-flex">
                                <h2>Tên chiến lược</h2>
                            </div>
                            <div class="wrap-left_body">
                                <ul>
                                    <li>
                                        <div class="title-item"> <a class="title" href="">Chiến lược Test</a></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="wrap-right">
                            <div class="wrap-right_header d-flex align-items-center justify-content-between">
                                <div class="wrap-right_header--title d-flex align-items-center"><img class="icon" src="/asset/images/icons/list.svg" alt="" />
                                    <h2>&nbsp; Danh sách trúng giải</h2>
                                </div>
                                <div class="wrap-right_header--sort wrap-tabs d-flex align-items-center">
                                    <div class="tab-content">
                                        <div class="b-tab active" id="year">
                                            <select>
                                                <option value="hide">Năm</option>
                                                <option value="2022">2022</option>
                                                <option value="2021">2021</option>
                                            </select>
                                        </div>
                                        <div class="b-tab" id="mounth">
                                            <select>
                                                <option value="hide">Tháng</option>
                                                <option value="january">Tháng 1</option>
                                                <option value="february">Tháng 2 </option>
                                            </select>
                                        </div>
                                    </div>
                                    <ul class="tab-list d-flex align-items-center">
                                        <li> <a class="b-nav-tab" href="javascript:;" data-tab="mounth">Tháng</a></li>
                                        <li> <a class="b-nav-tab active" href="javascript:;" data-tab="year">Năm</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="wrap-right_body">
                                <table>
                                    <thead>
                                        <th>
                                            <p>Tên Khách hàng</p>
                                        </th>
                                        <th>
                                            <p>Tên giải thưởng</p>
                                        </th>
                                        <th>
                                            <p>Ngày quay</p>
                                        </th>

                                    </thead>
                                    {
                                        listLogSpin?.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <p>{item?.masterAllocationSelected?.masterId}</p>
                                                    </td>
                                                    <td>
                                                        <p>
                                                            <img class="icon" src="/asset/images/icons/gift-2.svg" alt="" />
                                                            {item?.proxyStrategyPrize?.channelPrize?.name}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p>
                                                            {item?.spinDate}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </body>
    )
}

LogSpinComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default mobileDetectHOC(withStyles(styles)(LogSpinComponent));