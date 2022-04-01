import TopBarProgress from "react-topbar-progress-indicator";

function TopBarProgressComponent(props) {
    TopBarProgress.config({
        barColors: {
            "0": "#be1128",
            "1.0": "#be1128"
        },
        shadowBlur: 1
    });

    return (
        <>
            <TopBarProgress />
        </>
    );
}

export default TopBarProgressComponent;