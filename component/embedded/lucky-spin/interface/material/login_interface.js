export const style_login_default = (data) => {
    const type_otp = data?.authRequire?.type === "otp";
    return <div class="panel_luckySpin" id="home">
        <div className="row">
            <div className="col-md-12">
                <span>Nhập master id</span>
                <input className="inputstyle" onChange={(e) => {
                    const value = e.target?.value;
                    data?.inputEvent('master_id', value)
                }} type="text"></input>
            </div>
            <div className="col-md-12">
                <span>Nhập master code </span>
                <input className="inputstyle" onChange={(e) => {
                    const value = e.target?.value;
                    data?.inputEvent('master_pass', value)
                }} type="text"></input>
            </div>
            {
                type_otp && <div className="col-md-12">
                    <span>OTP <a href="#">&nbsp; &nbsp;Lấy mã OPT</a></span>
                    <input className="inputstyle" onChange={(e) => {
                        const value = e.target?.value;
                        data?.inputEvent('otp', value)
                    }} type="text"></input>
                </div>
            }
        </div>
        <br />
        <button class="btn_luckyspin" onClick={() => data?.checkAuthSpin()}>Truy cập</button>
    </div>
}

export const style_login_new = (data) => {
    const type_otp = data?.authRequire?.type === "otp";
    return <div class="panel_luckySpin" style={{ backgroundImage: "url('https://o.vdoc.vn/data/image/2022/01/25/hinh-nen-tet-1.gif')" }} id="home">
        <div className="row" style={{
            background: "#ffffff",
            padding: "40px",
            borderRadius: '40px'
        }}>
            <div className="col-md-12">
                <span>Tên truy cập</span>
                <input className="inputstyle" onChange={(e) => {
                    const value = e.target?.value;
                    data?.inputEvent('master_id', value)
                }} type="text"></input>
            </div>
            <div className="col-md-12">
                <span>Mã pin </span>
                <input className="inputstyle" onChange={(e) => {
                    const value = e.target?.value;
                    data?.inputEvent('master_pass', value)
                }} type="text"></input>
            </div>
            {
                type_otp && <div className="col-md-12">
                    <span>OTP <a href="#">&nbsp; &nbsp;Lấy mã OPT</a></span>
                    <input className="inputstyle" onChange={(e) => {
                        const value = e.target?.value;
                        data?.inputEvent('otp', value)
                    }} type="text"></input>
                </div>
            }
            <div className="col-md-12">
                <hr />
                <button class="btn_luckyspin pw2" onClick={() => data?.checkAuthSpin()}>Truy cập</button>
            </div>
        </div>
    </div>
}

export const style_login_HDBank = (data) => {
    const type_otp = data?.authRequire?.type === "otp";
    return <section class="main-wrapper" style={{ backgroundImage: `url(/asset/images/luckyspin/theme/HDbank/background/bg-1.jpg) !important` }} >
        <div class="wrapper-container d-flex align-items-center justify-content-center">
            <div class="wrap-login"> <a href=""><img class="logo" src="/asset/images/luckyspin/theme/HDbank/background/logo.png" alt="" /></a>
                <div class="login-title">
                    <p class="small-txt">Chào mừng bạn đến với</p>
                    <h1 class="big-txt">Vòng quay may mắn</h1>
                </div>
                <form class="wrap-form" action="">
                    <div class="form-group">
                        <label class="label" for="">Tên truy cập</label>
                        <input class="form-control" onChange={(e) => {
                            const value = e.target?.value;
                            data?.inputEvent('master_id', value)
                        }} type="text" placeholder="Nhập tên user" />
                    </div>
                    <div class="form-group">
                        <label class="label" for="">Mã Pin</label>
                        <input class="form-control" onChange={(e) => {
                            const value = e.target?.value;
                            data?.inputEvent('master_pass', value)
                        }} id="core" type="password" placeholder="Nhập mã pin" />
                        <img class="show-pass" src="/asset/images/luckyspin/theme/HDbank/background/eye.svg" alt="" />
                    </div>
                    <button class="btn btn-submit" onClick={() => data?.checkAuthSpin()}> <span>Truy cập ngay</span></button>
                </form>
            </div>
        </div>
    </section>
}
