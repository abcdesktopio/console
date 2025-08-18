import React from "react";
import { BanPageTemplate } from "../components/BanPageTemplate";

// Page component for managing Login bans.
// Simply delegates all logic/UI to the generic BanPageTemplate, specifying banType="Login".
export function BanLogin() {
    return <BanPageTemplate banType="Login" />;
}  