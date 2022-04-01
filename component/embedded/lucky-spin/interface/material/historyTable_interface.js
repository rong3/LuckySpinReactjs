export const historyStyleDefault = (data) => {
    const renderTable = () => {
        return <>
            <button class="btn_luckyspin" onClick={() =>
                data?.reset_wheel()
            }>Xoá log</button>
            <br />
            <table className="table table-border">
                <tr>
                    <th>Thứ tự</th>
                    <th>Master Id</th>
                    <th>Master name</th>
                    <th>Kết quả</th>
                    <th>Thời gian</th>
                </tr>
                {
                    data?.historyWheel?.data?.map((item, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item?.id}</td>
                                <td>{item?.name}</td>
                                <td>{item?.prize}</td>
                                <td>{item?.time}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </>
    }
    return (
        data?.historyWheel?.data?.length > 0 &&
        <>
            {
                !data?.isMobile ?
                    <div className="col-md-4" style={{ position: 'absolute', top: 0 }}
                        align="center">
                        <br />
                        <div className="boxform">
                            {renderTable()}
                        </div>
                    </div>
                    :
                    <div className="col-md-12" align="center">
                        <br />
                        <div className="boxform">
                            {renderTable()}
                        </div>
                    </div>
            }
        </>

    );
}