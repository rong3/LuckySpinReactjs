import React from "react";
import TopBarProgressComponent from "../../shared/packages/control/loaderIndicator";


function Loading(props) {
    return (
        props.loading &&
        <div id="loading-container">
            <div class="loading-wrapper">
                <div id="loading-logo">
                    <div class="loading-spinner-rolling">
                        <div class="ldio">
                            <div></div>
                        </div>
                    </div>
                </div>
                <div class="progress-status">Đang tải</div>
            </div>
        </div>
        // <TopBarProgressComponent />
    );
}

export default Loading;