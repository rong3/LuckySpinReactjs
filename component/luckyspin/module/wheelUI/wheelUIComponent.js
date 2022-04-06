import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import mobileDetectHOC from "../../../../shared/packages/hocs/mobileDetect"
import { usePermission } from "../../../../shared/packages/provider/accessGateway"
import withPermission from "../../../../shared/packages/hocs/permission/permissionHOC"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WheelInstanceComponent from "./subComponent/wheelInstance/wheelInstance"
import PrizeInstanceComponent from "./subComponent/prizeInstance/prizeInstance"
import ThemeInstanceComponent from "./subComponent/themeInstance/themeInstance"

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function WheelUIComponent(props) {
    const { addToast } = useToasts();
    return (
        <div className="content">
            <div className='wrapper-tab'>
                <Tabs>
                    <TabList>
                        <Tab>Quản lý giao diện vòng quay</Tab>
                        <Tab>Quản lý giải thưởng</Tab>
                        <Tab>Quản lý chủ đề vòng quay</Tab>
                    </TabList>
                    <TabPanel>
                        <WheelInstanceComponent />
                    </TabPanel>
                    <TabPanel>
                        <PrizeInstanceComponent />
                    </TabPanel>
                    <TabPanel>
                        <ThemeInstanceComponent />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}

WheelUIComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(WheelUIComponent)));