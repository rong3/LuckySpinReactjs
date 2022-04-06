import React from "react";
import { useRouter } from 'next/router'
import { map } from "jquery";

function DashBoardComponent(props) {
    const router = useRouter()

    const apps = [
        {
            name: 'Lucky Spin',
            route: '/embedded/lucky-spin'
        }
    ]

    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="container-dashboard">
                    {
                        apps?.map((item, index) => {
                            return (
                                <div className="item" onClick={() => changeRoute(item.route)}>
                                    {item?.name}
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    );
}

export default DashBoardComponent;