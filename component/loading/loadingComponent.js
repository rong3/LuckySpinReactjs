import React from "react";
import TopBarProgressComponent from "../../shared/packages/control/loaderIndicator";


function Loading(props) {
    return (
        props.loading &&
        <TopBarProgressComponent />
    );
}

export default Loading;