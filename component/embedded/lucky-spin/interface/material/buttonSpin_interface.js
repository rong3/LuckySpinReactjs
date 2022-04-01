export const buttonDefaultStyle = (data) => {
    return <div className="col-md-12" align="center">
        <button class="btn_luckyspin" disabled={data?.disabled} onClick={() => data?.startSpin()}>Quay</button>
    </div>
}

export const buttonNewStyle = (data) => {
    return <div className="col-md-12" align="center">
        <button class="btn_luckyspin pw2" disabled={data?.disabled} onClick={() => data?.startSpin()}>Buzz!!!</button>
    </div>
}

export const buttonHDBankStyle = (data) => {
    return <div class="button">
        <button class="btn btn-submit" disabled={data?.disabled} onClick={() => data?.startSpin()}> <span>QUAY NGAY</span></button>
    </div>
}