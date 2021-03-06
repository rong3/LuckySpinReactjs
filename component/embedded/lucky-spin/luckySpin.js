import React, { useEffect, useState } from "react";
import ConfigSpinComponent from "./configSpin"
import EditorSpinComponent from "./editorSpin"
import { theme_area } from "./interface/coreInterface"
import { channel_spin, category_client, group_allocation, category_wheel, theme_instance, type_allocation } from "./data/masterData"
import mobileDetectHOC from "../../../shared/packages/hocs/mobileDetect"
import { transformWheelData } from "./data/convertData"
import { authGateWayMasterSelected } from "../../../services/masterAllocationSelected.service"
import { spinService } from "../../../services/logSpin.service"
import { CookieHelper } from "../../../shared/packages/utils/cookie"
import { authenticationConstant } from "../../../shared/packages/globalConstant/authenticationConstant"

const LuckySpinComponent = (props) => {
    let handImage = null;
    const [loadingWheel, setLoadingWheel] = useState(false);
    const [default_config_data, setDefaultConfigData] = useState(null)
    const [devMode, setDevMode] = useState(false);
    const [wheelInstance, setWheelInstance] = useState(null)
    let [wheelSpinning, setWheelSpinning] = useState(false)
    const [import_config, setImport_config] = useState(null);
    const [loading, setLoading] = useState(false)
    const [authRequire, setAuthRequire] = useState({
        type: type_allocation[2]?.objectKey,
        enabled: false,
        isAuth: false,
        isOtp: false,
        credential: {
            id: null,
            pass: null,
            otp: null
        },
        masterSelectedId: null,
        dataUser: null
    })

    const [historyWheel, setHistoryWheel] = useState({
        type: null,
        data: []
    })

    const [master_config_data, setMasterConfig] = useState(null)

    const resetAuthData = () => {
        authRequire.credential.id = null;
        authRequire.credential.name = null;
        authRequire.credential.otp = null;
        authRequire.dataUser = null
        authRequire.masterSelectedId = null;
    }

    const setDefault = () => {
        setDefaultConfigData({
            channel: channel_spin[2],
            categoryClient: category_client[2],
            allocation: group_allocation[3],
            wheel_config: category_wheel[0],
            theme: theme_instance[4]
        })
    }

    useEffect(() => {
        setLoadingWheel(true);
    }, [])

    useEffect(() => {
        if (master_config_data) {
            handImage = new Image();
            initWheel(master_config_data);
        }
    }, [master_config_data])

    useEffect(() => {
        if (authRequire.enabled)
            settingTheme();
    }, [authRequire.enabled])

    useEffect(() => {
        if (props?.data || props?.id) {
            try {
                const data = transformWheelData(props?.data);
                // console.log({ data: data });
                setDefaultConfigData(data)
            }
            catch {
                // setDefault()
                // setTimeout(() => {
                //     setLoadingWheel(false);
                // }, 100);
            }
        }
        else {
            setLoadingWheel(false);
            setDefault()
        }
    }, [props?.data])

    useEffect(() => {
        if (default_config_data) {
            importData(default_config_data);
            setLoadingWheel(false);
        }
    }, [default_config_data])

    useEffect(() => {
        if (import_config) {
            const wheel_instance = import_config?.wheel_config?.spin_config;
            initPrizes(wheel_instance);
            //auth Check
            const typeAuth = import_config?.allocation?.type;
            authRequire.type = typeAuth
            if (['in-system', 'out-system'].includes(typeAuth)) {
                authRequire.enabled = true;
                if (CookieHelper.getCookie("access_token")) {
                    authRequire.isAuth = true;
                }
                else {
                    authRequire.isAuth = false;
                    resetAuthData();
                }
                authRequire.isOtp = false;
                setAuthRequire({ ...authRequire })
            }
            if (['non-system'].includes(typeAuth)) {
                authRequire.enabled = false;
                authRequire.isAuth = false;
                authRequire.isOtp = false;
                resetAuthData();
                setAuthRequire({ ...authRequire })
            }
            if (['otp-system'].includes(typeAuth)) {
                authRequire.enabled = true;
                authRequire.isAuth = false;
                authRequire.isOtp = true;
                resetAuthData();
                setAuthRequire({ ...authRequire })
            }
            settingTheme();

        }

    }, [import_config])

    /**
     * INIT instance of wheel
     * @param {*} master_config_data 
     */

    const settingTheme = () => {
        //theme setting
        const theme_instance = import_config?.theme?.config_json;
        var wrapper = document.getElementById('luckyspin-wrapper');
        if (wrapper)
            wrapper.style.backgroundImage = `url(${props?.isMobile ? theme_instance?.main_bg_mb : theme_instance?.main_bg})`;

        var wrapperLogin = document.getElementById('login-wrapper');
        if (wrapperLogin)
            wrapperLogin.style.backgroundImage = `url(${props?.isMobile ? theme_instance?.main_bg_mb : theme_instance?.main_bg})`;
    }

    const initPrizes = (wheel_instance) => {
        const isImagePrize = wheel_instance?.imageRender;
        //setting it up!
        const prizesTotal = wheel_instance?.prizes?.filter(x => !x?.hidden)?.sort((a, b) => a.position - b.position) ?? [];
        //convert segment
        const segmentData_convert = prizesTotal?.map(item => {
            return (
                isImagePrize ?
                    {
                        ...item,
                        id: item?.id,
                        fillStyle: item?.color,
                        text: item?.name,
                        textFontSize: item?.textFontSize,
                        textFillStyle: item?.textFillStyle,
                        strokeStyle: item?.strokeStyle,
                        image: item?.imgPrize
                    }
                    :
                    {
                        ...item,
                        id: item?.id,
                        fillStyle: item?.color,
                        textFontSize: item?.textFontSize,
                        textFillStyle: item?.textFillStyle,
                        strokeStyle: item?.strokeStyle,
                        text: item?.name
                    }
            )
        })
        //other setting up
        setMasterConfig({ ...wheel_instance, prizes: segmentData_convert })
    }

    const initWheel = (master_config_data) => {
        // Create new wheel object specifying the parameters at creation time.
        let theWheel = new Winwheel({
            'numSegments': master_config_data.prizes.length,   // Specify number of segments.
            'outerRadius': master_config_data.object.outerRadius,  // Set radius to so wheel fits the background.
            'innerRadius': master_config_data.object.innerRadius,  // Set inner radius to make wheel hollow.
            'textFontSize': master_config_data.object.textFontSize,   // Set font size accordingly.
            'textMargin': master_config_data.object.textMargin,    // Take out default margin.
            'textOrientation': master_config_data.object.textOrientation,
            'textAlignment': master_config_data.object.textAlignment,
            'textFontFamily': master_config_data.object.textFontFamily,
            'textStrokeStyle': master_config_data.object.textStrokeStyle,
            'textLineWidth': master_config_data.object.textLineWidth,
            'lineWidth': master_config_data.object.lineWidth,
            'textFillStyle': master_config_data.object.textFillStyle,
            'segments': master_config_data.prizes,      // Define segments including colour and text.
            'drawMode': master_config_data.imageRender ? 'segmentImage' : '',
            'drawText': master_config_data.drawText,
            'rotationAngle': master_config_data.object.rotationAngle,
            'pins':
            {
                'number': master_config_data.prizes.length,
                'fillStyle': master_config_data.pins.fillStyle,
                'outerRadius': master_config_data.pins.outerRadius,
                'responsive': master_config_data.pins.responsive, // This must be set to true if pin size is to be responsive, if not just location is.
            },
            'animation':           // Define spin to stop animation.
            {
                'clearTheCanvas': false,
                'type': master_config_data.animation.type,
                'duration': master_config_data.animation.duration,
                'spins': master_config_data.animation.spins,
                'soundTrigger': master_config_data.animation.soundTrigger,
                'callbackBefore': null,                // Function to callback before the wheel is drawn each animation loop.
                'callbackAfter': callbackAnimateSpin,
                'callbackFinished': alertPrize,
            },
        });

        setWheelInstance(theWheel)

        var canvas = document.getElementById('canvas');
        if (canvas) {
            try {
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                //setting bg-wheel
                var bg_wheel_instance = document.getElementById('the_wheel');
                bg_wheel_instance.style.backgroundImage = `url(${master_config_data.wheel_bg})`;
                //draw pointer
                drawImagePointer(canvas, master_config_data.canvas?.pointerExtenal);
                //config canvas
                canvas.style.marginTop = master_config_data.canvas.margin.top + 'px';
                canvas.style.marginLeft = master_config_data.canvas.margin.left + 'px';
                canvas.style.marginRight = master_config_data.canvas.margin.right + 'px';
                canvas.style.marginBottom = master_config_data.canvas.margin.bottom + 'px';
                theWheel.draw();
            }
            catch { }
        }
    }

    const drawPointerCanvas = (canvas, instance) => {
        let ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.save();
            //postion
            ctx.translate(instance.translateX, instance.translateY);
            ctx.rotate(instance.rotate * Math.PI / 180);  // Here I just rotate the image a bit.
            ctx.drawImage(handImage, instance.drawX, instance.drawY);   // Draw the image at the specified x and y.
            ctx.restore();
        }
    }

    const drawImagePointer = (canvas, instance) => {
        if (master_config_data.canvas?.pointerExtenal?.isUse) {
            // Set onload of the image to anonymous function to draw on the canvas once the image has loaded.
            handImage.onload = function () {
                drawPointerCanvas(canvas, instance)
            };
            // Set source of the image. Once loaded the onload callback above will be triggered.
            handImage.src = instance.url;
        }
    }

    function callbackAnimateSpin() {
        if (master_config_data.canvas?.pointerExtenal?.isUse) {
            var canvas = document.getElementById('canvas');
            if (canvas) {
                const instance = master_config_data.canvas?.pointerExtenal;
                // handImage.src = instance.url;
                drawPointerCanvas(canvas, instance)
            }
        }
    }

    // Called from Click of the Spin button.
    function startWheelSpin() {
        if (props?.id && authRequire.enabled) {
            spinService({
                "strategySpinId": props?.id
            }).then((res) => {
                const data = res?.data;
                if (data?.succeeded) {
                    if (data?.data > 0) {
                        wheelInstance.animation.stopAngle = data?.data;
                    }
                    // May as well start the spin from here.
                    applause_audio.pause();
                    applause_audio.currentTime = 0;
                    wheel_audio.play();
                    wheelInstance.rotationAngle = 0;
                    wheelInstance.startAnimation();
                }
                else {
                    resetWheel();
                    swal(
                        "L???i",
                        data?.message,
                        "error"
                    );
                }
            }).catch((err) => {
                resetWheel();
                swal(
                    "L???i",
                    err?.message,
                    "error"
                );
            })
        }
        else {
            // May as well start the spin from here.
            applause_audio.pause();
            applause_audio.currentTime = 0;
            wheel_audio.play();
            wheelInstance.startAnimation();
        }
    }

    // -------------------------------------------------------
    // Click handler for spin button.
    // -------------------------------------------------------
    function startSpin() {
        // Ensure that spinning can't be clicked again while already running.
        if (wheelSpinning == false) {
            resetWheel()
            // Begin the spin animation by calling startAnimation on the wheel object.
            startWheelSpin()
            // Set to true so that power can't be changed and spin button re-enabled during
            // the current animation. The user will have to reset before spinning again.
            setWheelSpinning(true);
        }
    }

    // -------------------------------------------------------
    // Function for reset button.
    // -------------------------------------------------------
    function resetWheel() {
        wheelInstance.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
        wheelInstance.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
        // wheelInstance.draw();                // Call draw to render changes to the wheel.
        setWheelSpinning(false);        // Reset to false to power buttons and spin can be clicked again.
    }

    // -------------------------------------------------------
    // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
    // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
    // -------------------------------------------------------
    function alertPrize(indicatedSegment) {
        wheel_audio.pause();
        wheel_audio.currentTime = 0;
        applause_audio.play();
        swal(
            "",
            indicatedSegment?.msgExtra ? indicatedSegment?.msgExtra :
                "B???n ???? quay v??o " + indicatedSegment?.text + ".",
            "success"
        );
        setWheelSpinning(false);
    }

    /**
     * Apply editor preview
     * @param {*} obj 
     */
    const editor_config_apply = (obj) => {
        handImage = new Image();
        initPrizes(obj);
        initWheel(obj);
        settingTheme();
    }

    /**
     *  //pass func to config mode
     * @param {*} data 
    */
    const importData = (data) => {
        reset_wheel();
        setImport_config({ ...data })
    }

    const changeDevMode = (boolean) => {
        //close modal
        setDevMode(boolean)
    }

    const reset_wheel = () => {
        historyWheel.type = null;
        historyWheel.data.length = 0;
        setHistoryWheel({ ...historyWheel })
    }

    /**Authorize func */
    //enable auth
    function checkAuthSpin() {
        setLoading(true)
        authGateWayMasterSelected({
            "strategyId": props?.id,
            "groupAllocationId": import_config.allocation?.id,
            "masterId": authRequire.credential.id,
            "masterCode": authRequire.credential.pass,
            "masterProps": {}
        }).then((res) => {
            const response = res?.data?.data;
            if (response?.success) {
                authRequire.masterSelectedId = response?.masterId;
                localStorage.setItem("keyName", authRequire.credential.id)
                authRequire.enabled = true;
                authRequire.isAuth = true;
                CookieHelper.setCookie(authenticationConstant.tokenKey, response?.access_Token);
                setAuthRequire({ ...authRequire })
                setLoading(false)
                setTimeout(() => {
                    editor_config_apply(master_config_data)
                }, 0);
            }
            else {
                setLoading(false)
                localStorage.removeItem("keyName");
                CookieHelper.removeCookie(authenticationConstant.tokenKey);
                swal(
                    "Th??ng tin",
                    res?.data?.message ?? "M?? kh??ng h???p l???",
                    "error"
                );
            }
        })
    }

    const inputEvent = (type, data) => {
        if (type === 'master_id') {
            authRequire.credential.id = data;
            setAuthRequire({ ...authRequire })
        }
        if (type === 'master_pass') {
            authRequire.credential.pass = data;
            setAuthRequire({ ...authRequire })
        }
        if (type === 'otp') {
            authRequire.credential.otp = data;
            setAuthRequire({ ...authRequire })
        }
    }

    const renderName = () => {
        try {
            if (['in-system'].includes(authRequire.type)) {
                return authRequire.credential.id ?? localStorage?.getItem("keyName") ?? "Kh??ch"
            }
            else {
                return authRequire.credential.id ?? localStorage?.getItem("keyName") ?? 'Kh??ch'
            }
        }
        catch { }
    }

    return (
        props?.dataFailed ?
            <section
                className="page404"
                style={{
                    borderRadius: '20px',
                    backgroundImage: `url(/asset/images/producttion/bg.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                }}
            >
                <div className="page-container">
                    {

                        <>
                            <div className="page-title">
                                <h1>Oops!</h1>
                                <h2>D??? li???u v??ng quay kh??ng t???n t???i</h2>
                            </div>
                        </>
                    }
                </div>
            </section>
            :
            <>
                <ConfigSpinComponent export={importData} devMode={changeDevMode} />
                {
                    (authRequire.enabled && !authRequire.isAuth) ?
                        <div class="luckyspin-wrapper" id="login-wrapper">
                            {
                                {
                                    ...
                                    theme_area(import_config?.theme?.config_json?.key, {
                                        authRequire: authRequire,
                                        inputEvent: inputEvent,
                                        checkAuthSpin: checkAuthSpin,
                                        loading: loading
                                    })?.login
                                }
                            }
                        </div>
                        :
                        loadingWheel ||
                        <>
                            <header>
                                <nav class="navbar d-flex align-items-center justify-content-between">
                                    <div class="navbar-brand"> <a> <img src="/asset/images/luckyspin/theme/HDBank_OPT2/background/logo2.png" alt="" /></a></div>
                                    <div class="navbar-right">
                                        <div class="dropdown"><a class="navbar-avatar dropdown-toggle" href="#">
                                            <img class="avatar" src="/asset/images/luckyspin/theme/HDbank/background/avarta.png" alt="" />
                                            <p style={{ color: "#000" }}>&nbsp; Xin ch??o, {renderName()}</p></a>
                                            <ul class="dropdown-menu">
                                                <li onClick={() => {
                                                    CookieHelper.removeCookie("access_token");
                                                    window.location.reload();
                                                }}><a>????ng xu???t</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </nav>
                            </header>

                            <section class="luckyspin-wrapper main-wrapper page-circle" id="luckyspin-wrapper">
                                <div class="wrapper-container d-flex align-items-center justify-content-center">
                                    <div class="wrap-circle">
                                        <div class="panel_luckySpin" id="home">
                                            <div align="center">
                                                <table cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td class="the_wheel" id="the_wheel" align="center" valign="center">
                                                            <canvas id="canvas" width={master_config_data?.canvas?.width} height={master_config_data?.canvas?.height} data-responsiveMinWidth={master_config_data?.canvas?.width}
                                                                data-responsiveScaleHeight="true">
                                                                <p>Sorry, your browser doesn't support canvas. Please try
                                                                    another.
                                                                </p>
                                                            </canvas>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div className="row" style={{ width: '100vw' }}>
                                                {
                                                    (props?.id === null || authRequire.type === "non-system") &&
                                                    <div className="col-md-12" align="center">
                                                        <a role={"button"} onClick={() => {
                                                            setDevMode(true)
                                                        }}>
                                                            <em className="material-icons">settings</em>
                                                        </a>
                                                    </div>
                                                }
                                                {
                                                    {
                                                        ...
                                                        theme_area(import_config?.theme?.config_json?.key, {
                                                            authRequire: authRequire,
                                                            disabled: wheelSpinning,
                                                            startSpin: startSpin
                                                        })?.spinBtn
                                                    }
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <audio controls="controls" id="wheel_audio" src={import_config?.theme?.config_json?.audio?.spinStart} type="audio/mp3"></audio>
                                <audio controls="controls" id="applause_audio" src={import_config?.theme?.config_json?.audio?.spinEnd} type="audio/mp3"></audio>
                            </section>
                            {
                                devMode &&
                                <EditorSpinComponent master_config_data={master_config_data} devMode={changeDevMode} editor_config_apply={editor_config_apply} />
                            }
                        </>
                }
            </>
    );
}

export default mobileDetectHOC(LuckySpinComponent);
