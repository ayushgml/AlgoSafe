import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { CurrentUserContext } from "../../context/CurrentUserContext";

function Home() {
	const { currentUser, handleLogout } = useContext(CurrentUserContext);

	const [showPassword, setShowPassword] = useState(false);
	const [passWordList, setPassWordList] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://localhost:6060/getSavedPasswords", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				// body: "{ \"email\": \"" + currentUser + "\" }",
				body: JSON.stringify({ email: "abc@gmail.com" }),
			});
			const data = await response.json();
			setPassWordList(data.savedPasswords);
			console.log(data.savedPasswords);
		}
		if (showPassword) {
			fetchData();
		}
		console.log(currentUser);
	}, [showPassword]);

	return (
		<div className="home">
			<Header login={true} signup={true} />
			<div className="home__container">
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
		</div>
	);
}

export default Home;
