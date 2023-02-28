import React, { useContext } from "react";
import "./Header.css";
import logo from "../../assets/algorand_logo.png";
import { Link } from "react-router-dom";

function Header( { login, signup } ) {
	
	return (
		<div className="header">
			<div className="header__left">
				<Link to="/">
					<img className="header__logo" src={logo} alt="Algosafe Logo" />
				</Link>
			</div>
			<div className="header__right">
				{login && (
					<div>
						<Link to="/login" className="header__right__login">
							Login
						</Link>
					</div>
				)}
				{signup && (
					<div>
						<Link to="/signup" className="header__right__signup">
							Sign Up
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

export default Header;
