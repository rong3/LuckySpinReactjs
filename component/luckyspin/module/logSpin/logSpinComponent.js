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
import { loadDataTable } from "../../../../redux/actions/strategyActions"
import { getListLiteStrategySpin } from "../../../../services/strategySpin.service"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function LogSpinComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [listLogSpin, setListLogSpin] = useState([]);
    const { t } = useTranslation('common');
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [strategyList, setStrategyList] = useState([])

    useEffect(() => {
        getListLiteStrategySpin({
            pageNumber: 1,
            pageSize: 999
        }).then((res) => {
            const data = res?.data?.data ?? [];
            setStrategyList([...data]);
        })
    }, [])

    useEffect(() => {
        if (selectedStrategy?.id) {
            getLogSpin({ keySearch: 'strategyId', keyValue: selectedStrategy?.id }).then((res) => {
                const data = res?.data?.data ?? [];
                var remapData = data?.map(x => (
                    {
                        strategySpinName: x?.proxyStrategyPrize?.strategySpin?.name,
                        spinDate: x?.spinDate,
                        masterName: x?.masterAllocationSelected?.masterId,
                        channelPrizeName: x?.proxyStrategyPrize?.channelPrize?.name,
                    }
                )).sort(function (a, b) {
                    return b?.prizeName?.localeCompare(a?.prizeName);
                })
                var groupKey = remapData.reduce(function (r, a) {
                    r[a.channelPrizeName] = r[a.channelPrizeName] || [];
                    r[a.channelPrizeName].push(a);
                    return r;
                }, Object.create(null));
                setListLogSpin(groupKey);
            })
        }
    }, [selectedStrategy])

    useEffect(() => {
        console.log({ listLogSpin });
    }, [listLogSpin])

    return (
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
                                    {
                                        strategyList?.map((item, i) => {
                                            return (
                                                <li onClick={() => {
                                                    setSelectedStrategy(item)
                                                }} className={item?.id === selectedStrategy?.id ? 'active' : ''}>
                                                    <div class="title-item">
                                                        <a class="title">
                                                            {item?.name}
                                                        </a>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </div>
                        </div>
                        <div class="wrap-right">
                            <div class="wrap-right_header d-flex align-items-center justify-content-between">
                                <div class="wrap-right_header--title d-flex align-items-center"><img class="icon" src="/asset/images/icons/list.svg" alt="" />
                                    <h2>&nbsp; Danh sách trúng giải {selectedStrategy?.name}</h2>
                                </div>
                                <div class="wrap-right_header--sort wrap-tabs d-flex align-items-center">
                                    <div class="tab-content">
                                    </div>
                                </div>
                            </div>
                            <div class="wrap-right_body">
                                {
                                    Object.keys(listLogSpin)?.map((itemOutside, i) => {
                                        const dataItem = listLogSpin[itemOutside];
                                        return (
                                            <Accordion style={{
                                                width: "100%",
                                                padding: '5px',
                                                boxShadow: 'none',
                                                marginBottom: "20px",
                                            }}>
                                                <AccordionSummary
                                                    expandIcon={
                                                        <>
                                                            <ExpandMoreIcon />
                                                        </>
                                                    }
                                                    aria-controls="panel1a-content"
                                                    IconButtonProps={{
                                                    }}
                                                >
                                                    <img class="icon" src="/asset/images/icons/gift-2.svg" alt="" />
                                                    &nbsp;
                                                    <b>{itemOutside}</b>
                                                    &nbsp;
                                                    {`(${dataItem?.length} khách hàng trúng giải)`}
                                                </AccordionSummary>
                                                <AccordionDetails>
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
                                                            dataItem?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <p>{item?.masterName}</p>
                                                                        </td>
                                                                        <td>
                                                                            <p>
                                                                                <img class="icon" src="/asset/images/icons/gift-2.svg" alt="" />
                                                                                {item?.channelPrizeName}
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
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    })
                                }
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