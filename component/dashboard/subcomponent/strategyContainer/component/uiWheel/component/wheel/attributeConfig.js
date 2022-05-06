export const sectionId = {
    size: {
        id: 1,
        name: 'Kích thước vòng quay'
    },
    dataWheel: {
        id: 2,
        name: 'Thông số vòng quay'
    },
    pointer: {
        id: 3,
        name: 'Thông số kim quay'
    },
    textStyle: {
        id: 4,
        name: 'Thông số kiểu chữ vòng quay'
    },
    sound: {
        id: 5,
        name: 'Âm thanh'
    }
}
export const attributesConfig = {
    wheel_bg: {
        label: "Ảnh vòng quay",
        value: "",
        section: sectionId.size,
        hide: true,
        col: 3
    },
    canvas_width: {
        label: "Độ rộng",
        value: 0,
        section: sectionId.size,
        hide: false,
        col: 3
    },
    canvas_height: {
        label: "Độ cao",
        value: 0,
        section: sectionId.size,
        hide: false,
        col: 3
    },
    canvas_margin_top: {
        label: "Canh lề trên",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    canvas_margin_left: {
        label: "Canh lề trái",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    canvas_margin_right: {
        label: "Canh lề phải",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    canvas_margin_bottom: {
        label: "Canh lề dưới",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    object_outerRadius: {
        label: "Bán kính vòng quay",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    object_innerRadius: {
        label: "Bán kính tâm vòng quay",
        value: 0,
        section: sectionId.dataWheel,
        hide: false,
        col: 3
    },
    object_rotationAngle: {
        label: "Độ lệch vòng quay",
        value: 0,
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    canvas_pointerExtenal_isUse: {
        label: "Sử dụng ảnh kim vòng quay",
        value: false,
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    canvas_pointerExtenal_translateX: {
        label: "Toạ độ X kim vòng quay",
        value: 0,
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    canvas_pointerExtenal_translateY: {
        label: "Toạ độ Y kim vòng quay",
        value: 0,
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    canvas_pointerExtenal_rotate: {
        label: "Độ lệch kim quay",
        value: 0,
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    canvas_pointerExtenal_url: {
        label: "Địa chỉ hình ảnh kim",
        value: '',
        section: sectionId.pointer,
        hide: false,
        col: 3
    },
    object_textFontSize: {
        label: "Kích thước Font",
        value: 15,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textMargin: {
        label: "Canh lề chữ",
        value: 20,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textOrientation: {
        label: "Hướng chữ",
        value: "horizontal",
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textAlignment: {
        label: "Căn chỉnh văn bản",
        value: "center",
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textFontFamily: {
        label: "Font Family",
        value: "monospace",
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textLineWidth: {
        label: "Độ dày văn bản",
        value: 5,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_lineWidth: {
        label: "Độ dày đường kẻ",
        value: 1,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    object_textFillStyle: {
        label: "Màu chữ",
        value: 'red',
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    // imageRender: {
    //     label: "Giải thưởng là ảnh?",
    //     value: false
    // },
    drawText: {
        label: "Chế độ vẽ chữ(always true)",
        value: true,
        section: sectionId.textStyle,
        hide: true,
        col: 3
    },
    animation_type: {
        label: "Kiểu hiệu ứng",
        value: "spinToStop",
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    animation_duration: {
        label: "Khoảng thời gian hiệu ứng",
        value: 5,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    animation_spins: {
        label: "Số chân vòng quay",
        value: 8,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    animation_soundTrigger: {
        label: "Kiểu kích hoạt âm thanh",
        value: 'pin',
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    /////
    pins_outerRadius: {
        label: "Bán kính chân vong quay",
        value: 0,
        section: sectionId.textStyle,
        hide: false,
        col: 3
    },
    pins_responsive: {
        label: "Chân vòng quay hỗ trợ responsive",
        value: true,
        section: sectionId.textStyle,
        hide: true,
        col: 3
    },
    audio_spinStart: {
        label: "Âm thanh khi bắt đầu quay",
        value: "/asset/images/luckyspin/audio/wheel.mp3",
        section: sectionId.sound,
        hide: false,
        col: 3
    },
    audio_spinEnd: {
        label: "Âm thanh khi quay kết thúc",
        value: "/asset/images/luckyspin/audio/applause.mp3",
        section: sectionId.sound,
        hide: false,
        col: 3
    },
}