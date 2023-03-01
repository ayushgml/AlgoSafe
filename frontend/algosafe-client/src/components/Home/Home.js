import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { CurrentUserContext } from "../../context/CurrentUserContext";

function Home() {
	const { currentUser, handleLogout } = useContext(CurrentUserContext);

	const [showPassword, setShowPassword] = useState(false);
	const [passWordList, setPassWordList] = useState([]);

	const [toSave, settoSave] = useState("");
	const [saveFor, setSavefor] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://localhost:6060/getSavedPasswords", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				// body: "{ \"email\": \"" + currentUser + "\" }",
				body: JSON.stringify({ email: currentUser }),
			});
			const data = await response.json();
			setPassWordList(data.savedPasswords);
		}
		if (showPassword) {
			fetchData();
		}
	}, [showPassword]);

	useEffect(() => {
		async function savePassword() {
			const response = await fetch("http://localhost:6060/savePassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: localStorage.getItem("algorand_password_manager_token"),
					toSave,
					saveFor,
				}),
			});
			const data = await response.json();
			if (data.message === "Password saved successfully") {
				alert("Password saved successfully!");
			} else {
				alert("Error!");
			}
		}

		if (submit) {
			savePassword();
		}
	}, [submit]);

	const handletoSaveChange = (event) => {
		settoSave(event.target.value);
	};

	const handleSaveforChange = (event) => {
		setSavefor(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSubmit(!submit);
	};

	return (
		<div className="home">
			<Header login={true} signup={true} />
			{localStorage.getItem("algorand_password_manager_token") === "" ? (
				<div className="home__not__logged__in">
					<div className="home__not__logged__in__text">
						You are not logged in. Please login to view your passwords!
					</div>
				</div>
			) : (
				<div className="home__container">
					<form className="form_pass">
						<div className="savefor">
							<h5 className="label">Save For:</h5>
							<input
								type="text"
								className="input"
								onChange={handleSaveforChange}
							/>
						</div>
						<div className="savefor">
							<h5 className="label">Password:</h5>
							<input
								type="text"
								className="input"
								onChange={handletoSaveChange}
							/>
						</div>
						<button
							type="submit"
							className="savepass_Button"
							onClick={handleSubmit}
						>
							Save Password
						</button>
					</form>
					<div
						onClick={() => setShowPassword(!showPassword)}
						className="show_pass"
					>
						{showPassword ? "Hide Passwords" : "Show Passwords"}
					</div>
					<div className="home__table">
						<div className="home__table__row__header">
							<div className="home__table__row__item">Website</div>
							<div className="home__table__row__item">Password</div>
						</div>
						{showPassword &&
							passWordList.map((item) => (
								<div className="home__table__row">
									<div className="home__table__row__item">{item.for}</div>
									<div className="home__table__row__item">{item.password}</div>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Home;
