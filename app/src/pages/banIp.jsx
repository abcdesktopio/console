import React from "react";
import { BanPageTemplate } from "../components/BanPageTemplate";

export function BanIP(){

    return(
        <React.Fragment> 
            <BanPageTemplate banType="IP" />
        </React.Fragment>
    )
}