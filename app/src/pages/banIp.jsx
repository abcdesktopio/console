import React from "react";
import { BanPageTemplate } from "../components/BanPageTemplate";

// Page component for managing IP bans.
// Simply delegates all logic/UI to the generic BanPageTemplate, specifying banType="IP".
export function BanIP() {
    return <BanPageTemplate banType="IP" />;
}  