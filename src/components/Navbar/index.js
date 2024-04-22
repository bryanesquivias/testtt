
// Filename - "./components/Navbar.js
 
import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        Home
                    </NavLink>
                    <NavLink to="/AccidentSeverity" activeStyle>
                    Accident Severity
                    </NavLink>
                    <NavLink to="/AccidentClusters" activeStyle>
                    Accident Clusters
                    </NavLink>
                    <NavLink to="/AccidentFrequency" activeStyle>
                    Accident Frequency
                    </NavLink>
                    <NavLink to="/TrafficFlow" activeStyle>
                    Traffic Flow
                    </NavLink>
                    <NavLink to="/SafetyMeasures" activeStyle>
                    Safety Measures
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;