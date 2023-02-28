import React, { useEffect, useState, createContext } from "react";

export const CurrentUserContext = createContext();

const CurrentUserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState();
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		checkLogin();
	}, []);

	const checkLogin = () => {
		const email = localStorage.getItem("algorand_password_manager_token");
		setAuthLoading(true);
		if (email) {
			fetch("http://localhost:6060/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			})
				.then((res) => res.json())
				.then((data) => {
					setAuthLoading(false);
					if (data.message === "User logged in successfully") {
						setCurrentUser(email);
					} else {
						setCurrentUser(null);
					}
				});
		} else {
			setAuthLoading(false);
			setCurrentUser(null);
		}
	};

	const testData = "Hello World";

	const handleLogout = () => {
		localStorage.removeItem("algorand_password_manager_token");
		setCurrentUser(null);
	};

	const stateValues = {
		currentUser,
		setCurrentUser,
		authLoading,
		setAuthLoading,
		handleLogout,
		checkLogin,
		testData,
	};

	return (
		<CurrentUserContext.Provider value={stateValues}>
			{children}
		</CurrentUserContext.Provider>
	);
};

export default CurrentUserProvider;
