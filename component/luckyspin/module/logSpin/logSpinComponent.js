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
    const [selectedStyleView, setSelectedStyleView] = useState(0);
    const dispatch = useDispatch();
    const [listLogSpin, setListLogSpin] = useState({
        list: [],
        group: {}
    });
    const { t } = useTranslation('common');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [strategyList, setStrategyList] = useState([])
    const [strategyListSearch, setStrategyListSearch] = useState([])


    useEffect(() => {
        getListLiteStrategySpin({
            pageNumber: 1,
            pageSize: 999
        }).then((res) => {
            // const isDescending = false;
            // const data = res?.data?.data?.sort((a, b) => isDescending ? new Date(b.created).getTime() - new Date(a.created).getTime() : new Date(a.created).getTime() - new Date(b.created).getTime()) ?? [];
            setStrategyListSearch([...res?.data?.data])
            setStrategyList([...res?.data?.data]);
        })
    }, [])

    useEffect(() => {
        if (selectedStrategy?.id) {
            setIsLoading(true);
            getLogSpin({ keySearch: 'strategyId', keyValue: selectedStrategy?.id }).then((res) => {
                const data = res?.data?.data ?? [];
                var remapData = data?.map(x => (
                    {
                        id: x?.id,
                        strategySpinName: x?.proxyStrategyPrize?.strategySpin?.name,
                        spinDate: x?.spinDate,
                        masterName: x?.masterAllocationSelected?.masterId,
                        channelPrizeName: x?.proxyStrategyPrize?.channelPrize?.name,
                    }
                )).sort(function (a, b) {
                    return a?.channelPrizeName?.localeCompare(b?.channelPrizeName);
                })
                var groupKey = remapData.reduce(function (r, a) {
                    r[a.channelPrizeName] = r[a.channelPrizeName] || [];
                    r[a.channelPrizeName].push(a);
                    return r;
                }, Object.create(null));

                setListLogSpin({
                    list: remapData,
                    group: groupKey
                });
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
        }
    }, [selectedStrategy])

    // useEffect(() => {
    //     console.log({ listLogSpin });
    // }, [listLogSpin])

    const columns = [
        {
            field: 'masterName',
            headerName: 'Tên Khách hàng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'channelPrizeName',
            headerName: 'Tên giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <p>
                    <img class="icon" src="/asset/images/icons/gift-2.svg" alt="" />
                    &nbsp;{cell?.row?.channelPrizeName}
                </p>
            }
        },
        {
            field: 'spinDate',
            headerName: 'Ngày quay',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },

    ]

    return (
        <body class="history">
            <header>
            </header>
            <main>
                <section class="history-section section-main">
                    {/* <h1 class="section-title d-flex align-items-center"> <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />&nbsp; Lịch sử chiến lược</h1> */}
                    <div class="wrapper-container d-flex">
                        <div class="wrap-left">
                            <div class="wrap-left_header d-flex">
                                <h2>Tên chiến lược</h2>
                            </div>
                            <div class="wrap-left_body">
                                <form class="wrap-form">
                                    <div class="form-group">
                                        <input class="form-control" type="text" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            const filter = [...strategyList]?.filter(x =>
                                                x?.name?.toLowerCase().trim()
                                                    .indexOf(value.toLowerCase().trim()) !== -1);
                                            setStrategyListSearch([...filter])
                                        }} placeholder="Tìm kiếm..." />
                                        <button type='button'><img src="/asset/images/icons/search.svg" alt="" /></button>
                                    </div>
                                </form>
                                <ul>
                                    {
                                        strategyListSearch?.map((item, i) => {
                                            return (
                                                <li onClick={() => {
                                                    if (!isLoading)
                                                        setSelectedStrategy(item)
                                                }} className={item?.id === selectedStrategy?.id ? 'active' : ''}>
                                                    <div class="title-item">
                                                        <a class="title">
                                                            {item?.name}
                                                        </a>
                                                        <div class="date"><span>{`Ngày tạo: ${item?.created}`} </span></div>
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
                                    <ul class="tab-list d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                        <li onClick={(e) => {
                                            setSelectedStyleView(0)
                                        }}>
                                            <span class={`b-nav-tab ${selectedStyleView === 0 ? 'active' : ''}`}>
                                                Xem kiểu nhóm
                                            </span>
                                        </li>
                                        <li onClick={() => setSelectedStyleView(1)}>
                                            <span class={`b-nav-tab ${selectedStyleView === 1 ? 'active' : ''}`}>
                                                Xem kiểu danh sách
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {
                                isLoading ?
                                    <div class="wrap-right_body">
                                        <p>Đang tải dữ liệu...</p>
                                    </div>
                                    :
                                    <div class="wrap-right_body">
                                        {
                                            selectedStyleView === 0 &&
                                            Object.keys(listLogSpin?.group)?.map((itemOutside, i) => {
                                                const dataItem = listLogSpin?.group[itemOutside];
                                                return (
                                                    <Accordion style={{
                                                        width: "100%",
                                                        padding: '5px',
                                                        boxShadow: 'none',
                                                        marginBottom: "5px",
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
                                                            <DataGridControl
                                                                rows={dataItem}
                                                                columns={columns}
                                                                count={dataItem?.length}
                                                                disableSelectionOnClick
                                                            />

                                                        </AccordionDetails>
                                                    </Accordion>
                                                )
                                            })
                                        }
                                        {
                                            selectedStyleView === 1 &&
                                            <DataGridControl
                                                rows={listLogSpin?.list}
                                                columns={columns}
                                                count={listLogSpin?.list?.length}
                                                disableSelectionOnClick
                                            />
                                        }
                                    </div>
                            }
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