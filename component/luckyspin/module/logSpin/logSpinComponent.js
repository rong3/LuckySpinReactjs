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
            headerName: 'Master Id',
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
        {
            field: 'created',
            headerName: 'Ngày tạo',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'lastModified',
            headerName: 'Ngày sửa lần cuối',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        }
    ]


    return (
        <div className={classes.root}>
            <div className="content">
                <div className="block-content">
                    <div className="row row-title mt-1">
                        <div className="col-md-12 table-height">
                            {
                                listLogSpin?.length &&
                                <DataGridControl
                                    rows={listLogSpin}
                                    columns={columns}
                                    count={listLogSpin.length}
                                    disableSelectionOnClick
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

LogSpinComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(LogSpinComponent)));