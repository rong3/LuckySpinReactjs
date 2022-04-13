import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import mobileDetectHOC from "../../../../shared/packages/hocs/mobileDetect"
import { usePermission } from "../../../../shared/packages/provider/accessGateway"
import withPermission from "../../../../shared/packages/hocs/permission/permissionHOC"
import Modal from "../../../../shared/packages/control/modal/index";
import showConfirm from "../../../../shared/packages/control/dialog/confirmation"
import ListBoxComponent from "../../../../shared/packages/control/listBox/listBox"
import SelectBox from "../../../../shared/packages/control/selectBox/selectBox"
import { InputControl } from "../../../../shared/packages/control/input/inputControl"
import { loadDataTableGroupAllocation } from "../../../../redux/actions/groupAllocationActions"
import { loadDataTableMasterObj } from "../../../../redux/actions/masterObjectAllocationActions"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GroupAllocationComponent from "./subComponent/groupAllocation"
import 'react-tabs/style/react-tabs.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function ProxyAllocationComponent(props) {
    const [allows] = usePermission();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const { classes } = props;
    const { t } = useTranslation('common');
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        dispatch(loadDataTableMasterObj({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableGroupAllocation({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])


    return (
        <div className={classes.root}>
            <div className="content content-wrapper">
                <div className="row row-title">
                    <div className='col-md-12'>
                        <div className='wrapper-tab'>
                            <Tabs>
                                <TabList>
                                    <Tab>Quản lý Nhóm phân bổ</Tab>
                                </TabList>
                                <TabPanel>
                                    <GroupAllocationComponent selectedGroup={selectedGroup}
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

ProxyAllocationComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(ProxyAllocationComponent)));