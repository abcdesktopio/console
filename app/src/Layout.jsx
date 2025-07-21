import React from "react";
import Sidebar from "./components/Sidebar";
import TopLeft from "./components/TopLeft";
import { Outlet } from "react-router-dom";

export function Layout(){
    return (
        <div className="wrapper">
            <TopLeft />
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}