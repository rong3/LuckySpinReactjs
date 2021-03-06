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
import { getLogSpin, deleteLogSpinService } from "../../../../services/logSpin.service"
import { loadDataTable } from "../../../../redux/actions/strategyActions"
import { getListLiteStrategySpin } from "../../../../services/strategySpin.service"
import showConfirm from "../../../../shared/packages/control/dialog/confirmation"
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
            headerName: 'T??n Kh??ch h??ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'channelPrizeName',
            headerName: 'T??n gi???i th?????ng',
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
            headerName: 'Ng??y quay',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Thao t??c',
            sortable: false,
            headerClassName: 'headerColumn',
            headerAlign: 'center',
            minWidth: 200,
            flex: 1,
            disableClickEventBubbling: true,
            renderCell: (cell) => {
                return renderActionGrid(cell)
            }
        },
    ]

    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo???`, "Xo??", "Tr??? v???");
                        if (confirm && params?.row?.id) {
                            deleteLogSpinService(params?.row?.id).then((res) => {
                                const temp = selectedStrategy.id;
                                selectedStrategy.id = null;
                                setSelectedStrategy({ ...selectedStrategy })
                                setTimeout(() => {
                                    selectedStrategy.id = temp;
                                    setSelectedStrategy({ ...selectedStrategy })
                                }, 0);
                                addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
                            });
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    return (
        <body class="history">
            <header>
            </header>
            <main>
                <section class="history-section section-main">
                    {/* <h1 class="section-title d-flex align-items-center"> <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />&nbsp; L???ch s??? chi???n l?????c</h1> */}
                    <div class="wrapper-container d-flex">
                        <div class="wrap-left">
                            <div class="wrap-left_header d-flex">
                                <h2>T??n chi???n l?????c</h2>
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
                                        }} placeholder="T??m ki???m..." />
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
                                                        <div class="date"><span>{`Ng??y t???o: ${item?.created}`} </span></div>
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
                                    <h2>&nbsp; Danh s??ch tr??ng gi???i {selectedStrategy?.name}</h2>
                                </div>
                                <div class="wrap-right_header--sort wrap-tabs d-flex align-items-center">
                                    <div class="tab-content">
                                    </div>
                                    <ul class="tab-list d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                        <li onClick={(e) => {
                                            setSelectedStyleView(0)
                                        }}>
                                            <span class={`b-nav-tab ${selectedStyleView === 0 ? 'active' : ''}`}>
                                                Xem ki???u nh??m
                                            </span>
                                        </li>
                                        <li onClick={() => setSelectedStyleView(1)}>
                                            <span class={`b-nav-tab ${selectedStyleView === 1 ? 'active' : ''}`}>
                                                Xem ki???u danh s??ch
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {
                                isLoading ?
                                    <div class="wrap-right_body">
                                        <p>??ang t???i d??? li???u...</p>
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
                                                            {`(${dataItem?.length} kh??ch h??ng tr??ng gi???i)`}
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