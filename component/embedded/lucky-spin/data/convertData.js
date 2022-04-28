export const transformWheelData = (dataOriginal) => {
    const wheelInstance = {
        ...dataOriginal?.wheelInstance,
        configJson: JSON.parse(dataOriginal?.wheelInstance?.configJson)
    };

    const themeInstance = {
        ...dataOriginal?.themeInstance,
        configJson: JSON.parse(dataOriginal?.themeInstance?.configJson)
    };

    return {
        channel: {
            id: dataOriginal?.channelSpin?.id,
            channel_name: dataOriginal?.channelSpin?.channelName,
            channel_desc: dataOriginal?.channelSpin?.channelDesc,
        },
        categoryClient: {
        },
        allocation: {
            id: dataOriginal?.groupAllocationId,
            object: dataOriginal?.masterObjectAllocation,
            type: dataOriginal?.masterObjectAllocation?.objectKey,
            data: dataOriginal?.groupAllocation?.masterAllocationSelecteds
        },
        wheel_config: {
            id: wheelInstance?.id,
            name: wheelInstance?.name,
            spin_config: {
                imageRender: wheelInstance?.configJson?.imageRender?.value,
                drawText: wheelInstance?.configJson?.drawText?.value,
                wheel_bg: wheelInstance?.configJson?.wheel_bg?.value,
                object: {
                    'outerRadius': wheelInstance?.configJson?.object_outerRadius?.value,
                    'innerRadius': wheelInstance?.configJson?.object_innerRadius?.value,
                    'textFontSize': wheelInstance?.configJson?.object_textFontSize?.value,
                    'textMargin': wheelInstance?.configJson?.object_textMargin?.value,
                    'textOrientation': wheelInstance?.configJson?.object_textOrientation?.value,
                    'textAlignment': wheelInstance?.configJson?.object_textAlignment?.value,
                    'textFontFamily': wheelInstance?.configJson?.object_textFontFamily?.value,
                    'textLineWidth': wheelInstance?.configJson?.object_textLineWidth?.value,
                    'lineWidth': wheelInstance?.configJson?.object_lineWidth?.value,
                    'textFillStyle': wheelInstance?.configJson?.object_textFillStyle?.value,
                    'rotationAngle': wheelInstance?.configJson?.object_rotationAngle?.value,
                },
                animation: {
                    'type': wheelInstance?.configJson?.animation_type?.value,
                    'duration': wheelInstance?.configJson?.animation_duration?.value,
                    'spins': wheelInstance?.configJson?.animation_spins?.value,
                    'soundTrigger': wheelInstance?.configJson?.animation_soundTrigger?.value,
                },
                pins: {
                    'outerRadius': wheelInstance?.configJson?.pins_outerRadius?.value,
                    'responsive': wheelInstance?.configJson?.pins_responsive?.value,
                },
                canvas: {
                    pointerExtenal: {
                        isUse: wheelInstance?.configJson?.canvas_pointerExtenal_isUse?.value,
                        translateX: wheelInstance?.configJson?.canvas_pointerExtenal_translateX?.value,
                        translateY: wheelInstance?.configJson?.canvas_pointerExtenal_translateY?.value,
                        drawX: wheelInstance?.configJson?.canvas_pointerExtenal_drawX?.value,
                        drawY: wheelInstance?.configJson?.canvas_pointerExtenal_drawY?.value,
                        rotate: wheelInstance?.configJson?.canvas_pointerExtenal_rotate?.value,
                        url: wheelInstance?.configJson?.canvas_pointerExtenal_url?.value,
                    },
                    width: wheelInstance?.configJson?.canvas_width?.value,
                    height: wheelInstance?.configJson?.canvas_height.value,
                    margin: {
                        top: wheelInstance?.configJson?.canvas_margin_top?.value,
                        left: wheelInstance?.configJson?.canvas_margin_left?.value,
                        right: wheelInstance?.configJson?.canvas_margin_right?.value,
                        bottom: wheelInstance?.configJson?.canvas_margin_bottom?.value,
                    },
                },
                prizes: dataOriginal?.groupChannelPrize?.channelPrizes?.map(item => {
                    const _findProxyAttr = dataOriginal?.proxyPrizeAtribute?.find(x => x.channelPrizeId === item?.id) ?? {};
                    return {
                        id: item?.id,
                        position: _findProxyAttr?.position,
                        allow_prize: _findProxyAttr?.allowPrizing,
                        name: item?.name,
                        imgPrize: item?.image,
                        color: item?.color,
                        strokeStyle: item?.strokeStyle,
                        textFillStyle: item?.textFillStyle,
                        textFontSize: item?.textFontSize,
                        percent: _findProxyAttr?.percent,
                        quantity: _findProxyAttr?.quantity,
                        hidden: _findProxyAttr?.hidden
                    }
                })
            },
        },
        theme: {
            id: themeInstance?.id,
            name: themeInstance?.name,
            config_json: {
                key: themeInstance?.configJson?.key?.value,
                main_bg: themeInstance?.configJson?.main_bg?.value,
                main_bg_mb: themeInstance?.configJson?.main_bg_mb?.value,
                style: themeInstance?.configJson?.style?.value??"",
                audio: {
                    spinStart: wheelInstance?.configJson?.audio_spinStart?.value,
                    spinEnd: wheelInstance?.configJson?.audio_spinEnd?.value,
                }
            }
        }
    }
}