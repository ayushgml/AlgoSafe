import React, { useState, useEffect } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";

function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [submit, setSubmit] = useState(false);
	const [successLogin, setSuccessLogin] = useState(false);

	useEffect(() => {
		async function login() {
			const response = await fetch("http://localhost:6060/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});
			const data = await response.json();
			console.log(data);
			if (data.message === "User created successfully") {
				setSuccessLogin(true);
			}
		}
		if (submit) {
			login();
		}
	}, [submit]);

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSubmit(!submit);
	};

	return (
		<div className="login">
			<Header login={true} signup={false} />
			<div className="login__container">
				<h1>Sign Up</h1>
				<form className="login__container__form">
					<div className="login__container__part">
						<h5 className="login__container__label">Name:</h5>
						<input
							type="text"
							className="login__container__input"
							onChange={handleNameChange}
						/>
					</div>
					<div className="login__container__part">
						<h5 className="login__container__label">E-mail:</h5>
						<input
							type="text"
							className="login__container__input"
							onChange={handleEmailChange}
						/>
					</div>
					<div className="login__container__part">
						<h5 className="login__container__label">Password:</h5>
						<input
							type="password"
							className="login__container__input"
							onChange={handlePasswordChange}
						/>
					</div>
					<button
						type="submit"
						className="login__signInButton"
						onClick={handleSubmit}
					>
						Sign Up
					</button>
				</form>
			</div>
			{ successLogin && (
			<div className="login__success">
					<Link to="/login" className="login__success__text">
						You have successfully signed up! Please login to continue.
					</Link>
			</div>
			) }
		</div>
	);
}

export default SignUp;
