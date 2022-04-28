import { style_login_default, style_login_new,style_login_HDBank } from "./material/login_interface"
import { buttonDefaultStyle, buttonNewStyle,buttonHDBankStyle } from "./material/buttonSpin_interface"
import { historyStyleDefault } from "./material/historyTable_interface"

export const theme_area = (index, data) => {
    switch (index) {
        case 4: return {
            login: style_login_new(data),
            spinBtn: buttonNewStyle(data),
            historyTable: historyStyleDefault(data)
        }
        case 5: return {
            login: style_login_HDBank(data),
            spinBtn: buttonHDBankStyle(data),
            historyTable: historyStyleDefault(data)
        }
        default: return {
            login: style_login_HDBank(data),
            spinBtn: buttonHDBankStyle(data),
            historyTable: historyStyleDefault(data)
        }
    }
}