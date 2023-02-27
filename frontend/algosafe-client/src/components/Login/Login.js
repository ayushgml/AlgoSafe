import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";

function Login() {
	return (
		<div className="login">
			<Header login={false} signup={true} />
			<div className="login__container">
				<h1>Sign in</h1>
				<form className="login__container__form">
					<h5>E-mail</h5>
					<input type="text" />
					<h5>Password</h5>
					<input type="password" />
					<button type="submit" className="login__signInButton">
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
