import React, { useEffect, useState } from "react";
import ConfigSpinComponent from "./configSpin"
import EditorSpinComponent from "./editorSpin"
import { enum_master_type } from "./data/enum"
import { theme_area } from "./interface/coreInterface"
import { channel_spin, category_client, group_allocation, category_wheel, theme_instance, type_allocation } from "./data/masterData"
import mobileDetectHOC from "../../../shared/packages/hocs/mobileDetect"

const LuckySpinComponent = (props) => {
    let handImage = null;
    const default_config_data = {
        channel: channel_spin[2],
        categoryClient: category_client[2],
        allocation: group_allocation[3],
        wheel_config: category_wheel[4],
        theme: theme_instance[4]
    }
    const [devMode, setDevMode] = useState(false);
    const [wheelInstance, setWheelInstance] = useState(null)
    let [wheelSpinning, setWheelSpinning] = useState(false)
    const [import_config, setImport_config] = useState(null);

    const [authRequire, setAuthRequire] = useState({
        type: type_allocation[2]?.key,
        enabled: false,
        isAuth: false,
        isOtp: false,
        credential: {
            id: null,
            pass: null,
            otp: null
        }
    })

    const [historyWheel, setHistoryWheel] = useState({
        type: null,
        data: []
    })

    const [master_config_data, setMasterConfig] = useState(null)
    //index of items which will be appeared
    //should be removed and be moved to BE
    const [custom_prize_allows, setCustomPrizeAllow] = useState({})

    useEffect(() => {
        if (master_config_data) {
            handImage = new Image();
            initWheel(master_config_data);
        }
    }, [master_config_data])

    useEffect(() => {
        importData(default_config_data)
    }, [])

    useEffect(() => {
        if (import_config) {
            console.log({ import_config });
            const wheel_instance = import_config?.wheel_config?.spin_config;
            //close modal
            document.getElementById('close_modal').click();
            initPrizes(wheel_instance);

            //auth Check
            const typeAuth = import_config?.allocation?.object?.key;
            authRequire.type = typeAuth
            if ([type_allocation[0]?.key, type_allocation[1]?.key].includes(typeAuth)) {
                authRequire.enabled = true;
                authRequire.isAuth = false;
                authRequire.isOtp = false;
                authRequire.credential.id = null;
                authRequire.credential.name = null;
                authRequire.credential.otp = null;
                setAuthRequire({ ...authRequire })
            }
            if ([type_allocation[2]?.key].includes(typeAuth)) {
                authRequire.enabled = false;
                authRequire.isAuth = false;
                authRequire.isOtp = false;
                authRequire.credential.id = null;
                authRequire.credential.name = null;
                authRequire.credential.otp = null;
                setAuthRequire({ ...authRequire })
            }
            if ([type_allocation[3]?.key].includes(typeAuth)) {
                authRequire.enabled = true;
                authRequire.isAuth = false;
                authRequire.isOtp = true;
                authRequire.credential.id = null;
                authRequire.credential.name = null;
                authRequire.credential.otp = null;
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
        wrapper.style.backgroundImage = `url(${theme_instance.main_bg}),${theme_instance.style}`;
    }



    const initPrizes = (wheel_instance) => {
        const isImagePrize = wheel_instance?.imageRender;
        //setting it up!
        const prizesTotal = wheel_instance?.prizes?.sort((a, b) => a.position - b.position) ?? [];
        //convert segment
        const segmentData_convert = prizesTotal?.map(item => {
            return (
                isImagePrize ?
                    {
                        ...item,
                        id: item?.id,
                        fillStyle: item?.color,
                        text: item?.name,
                        //size: winwheelPercentToDegrees(40),
                        // textFontSize: 18,
                        // textFillStyle: '#ffffff',
                        image: item?.imgPrize
                    }
                    :
                    {
                        ...item,
                        id: item?.id,
                        fillStyle: item?.color,
                        text: item?.name
                    }
            )
        })
        //other setting up
        setMasterConfig({ ...wheel_instance, prizes: segmentData_convert })

        //custom allow prizes
        if (!wheel_instance.random_prize) {
            const segmentAllow = prizesTotal?.filter(x => x.allow_prize)?.map(item => ({ key: item.position, value: item.percent }));
            const objectAllowConvert = segmentAllow?.reduce((obj, item) => ({
                ...obj,
                [item.key]: item.value
            }), {});
            setCustomPrizeAllow({ ...objectAllowConvert })
        }
        else {
            setCustomPrizeAllow({});
        }
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
                // 'clearTheCanvas': true, 
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
                handImage.src = instance.url;
                drawPointerCanvas(canvas, instance)
            }
        }
    }

    function transformRatiosToAccPercentages(ratios) {
        const total = ratios.reduce((sum, el) => sum += el, 0);
        let acc = 0;
        const accPercentages = ratios.map(rat => acc += rat / total);
        return accPercentages;
    }

    function chooseBiasedRandom(accPercentages) {
        const random = Math.random();
        const index = accPercentages.findIndex(acc => random < acc);
        return index;
    }

    function chooseRandomSuffle(arr) {
        try {
            const ratios = Object.values(arr);
            const accPercentages = transformRatiosToAccPercentages(ratios);
            const random = chooseBiasedRandom(accPercentages);
            return Number.parseInt(Object.keys(arr)[random]) ?? null;
        }
        catch {
            return null;
        }
    }

    // Called from Click of the Spin button.
    function startWheelSpin() {
        // This formula always makes the wheel stop somewhere inside prize 3 at least
        // 1 degree away from the start and end edges of the segment.
        //let stopAt = (36 * 3 + 1 + Math.floor((Math.random() * 35)))//stopAt;
        if (Object.keys(custom_prize_allows)?.length > 0) {
            const random_objAllow = chooseRandomSuffle(custom_prize_allows);
            if (random_objAllow) {
                const avg_rad = Math.round(360 / (wheelInstance.segments?.length - 1), 2);
                const rotationAngle = import_config?.wheel_config?.spin_config?.object?.rotationAngle ?? 0;
                let stopAt = (avg_rad * (random_objAllow - 1) + 5 + rotationAngle + Math.floor((Math.random() * (avg_rad - 5 - rotationAngle))))
                // console.log({ stopAt });
                // Important thing is to set the stopAngle of the animation before stating the spin.
                // Should be convert formula to BE then saved the angle stop deg to DB then and return the angle stop deg to FE
                wheelInstance.animation.stopAngle = stopAt;
            }
            else {
                swal(
                    "Lỗi",
                    "Vòng quay lỗi",
                    "error"
                );
            }
        }
        // May as well start the spin from here.
        applause_audio.pause();
        applause_audio.currentTime = 0;
        wheel_audio.play();
        wheelInstance.startAnimation();
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
        wheelInstance.draw();                // Call draw to render changes to the wheel.
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
            "Chúc mừng",
            "Bạn đã trúng " + indicatedSegment?.text + ".",
            "success"
        );
        importHistory(indicatedSegment?.text);
        setWheelSpinning(false);
    }


    //function import history
    function importHistory(result) {
        historyWheel.type = authRequire.type;
        if ([type_allocation[0]?.key, type_allocation[1]?.key, type_allocation[3]?.key].includes(authRequire.type)) {
            const model = {
                id: authRequire.credential.id,
                name: authRequire.credential.name,
                prize: result,
                time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
            }
            historyWheel.data.push(model);
        }
        if ([type_allocation[2]?.key].includes(authRequire.type)) {
            const model = {
                id: null,
                name: null,
                prize: result,
                time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
            }
            historyWheel.data.push(model);
        }
        setHistoryWheel({ ...historyWheel })
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
        document.getElementById('close_modal').click();
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
        if (authRequire.type === type_allocation[0]?.key) {
            if (import_config.allocation.data?.some(x =>
                x.master_id === authRequire.credential.id
            )) {
                authRequire.enabled = true;
                authRequire.isAuth = true;
                setAuthRequire({ ...authRequire })
                setTimeout(() => {
                    editor_config_apply(master_config_data)
                }, 0);
            }
            else {
                swal(
                    "Lỗi",
                    "Mã không hợp lệ",
                    "error"
                );
            }
        }

        if (authRequire.type === type_allocation[1]?.key) {
            if (import_config.allocation.data?.some(x =>
                x.master_code === authRequire.credential.pass &&
                x.master_id === authRequire.credential.id
            )) {
                authRequire.enabled = true;
                authRequire.isAuth = true;
                setAuthRequire({ ...authRequire })
                setTimeout(() => {
                    editor_config_apply(master_config_data)
                }, 0);
            }
            else {
                swal(
                    "Lỗi",
                    "Mã không hợp lệ",
                    "error"
                );
            }
        }

        if (authRequire.type === type_allocation[3]?.key) {
            if (import_config.allocation.data?.some(x =>
                x.master_code === authRequire.credential.pass &&
                x.master_id === authRequire.credential.id
            )) {
                authRequire.enabled = true;
                authRequire.isAuth = true;
                setAuthRequire({ ...authRequire })
                setTimeout(() => {
                    editor_config_apply(master_config_data)
                }, 0);
            }
            else {
                swal(
                    "Lỗi",
                    "Mã không hợp lệ",
                    "error"
                );
            }
        }
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

    return (
        <>
            <ConfigSpinComponent export={importData} devMode={changeDevMode} />
            {
                (authRequire.enabled && !authRequire.isAuth) ?
                    <div class="luckyspin-wrapper" id="luckyspin-wrapper">
                        {
                            theme_area(import_config?.theme?.config_json?.key, {
                                authRequire: authRequire,
                                inputEvent: inputEvent,
                                checkAuthSpin: checkAuthSpin
                            })?.login
                        }
                    </div>
                    :
                    <>
                        <header>
                            <nav class="navbar d-flex align-items-center justify-content-between">
                                <div class="navbar-brand"> <a href=""> <img src="/asset/images/luckyspin/theme/HDbank/background/logo.png" alt=""/></a></div>
                                <div class="navbar-right">
                                    <div class="dropdown"><a class="navbar-avatar dropdown-toggle" href="#"> <img class="avatar" src="/asset/images/luckyspin/theme/HDbank/background/avarta.png" alt=""/>
                                        <p>&nbsp; Xin chào, User</p></a>
                                        <ul class="dropdown-menu">
                                            <li><a href="">Logout</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                        </header>

                        <section class="main-wrapper page-circle" id="luckyspin-wrapper">
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
                                            <div className="col-md-12" align="center">
                                                <a role={"button"} href="#fade">
                                                    <em className="material-icons">settings</em>
                                                </a>
                                            </div>
                                            {
                                                theme_area(import_config?.theme?.config_json?.key, {
                                                    authRequire: authRequire,
                                                    disabled: wheelSpinning,
                                                    startSpin: startSpin
                                                })?.spinBtn
                                            }
                                            {
                                                theme_area(import_config?.theme?.config_json?.key, {
                                                    authRequire: authRequire,
                                                    reset_wheel: reset_wheel,
                                                    historyWheel: historyWheel,
                                                    isMobile: props?.isMobile
                                                })?.historyTable
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <audio controls="controls" id="wheel_audio" src={import_config?.theme?.config_json?.audio?.spinStart} type="audio/mp3"></audio>
                            <audio controls="controls" id="applause_audio" src={import_config?.theme?.config_json?.audio?.spinEnd} type="audio/mp3"></audio>
                            <script src="/asset/images/luckyspin/js/core_wheel.js"></script>
                            <script src="/asset/images/luckyspin/js/tweenMax.min.js"></script>
                            <script src="/asset/images/luckyspin/js/sweet_alert.min.js"></script>
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
