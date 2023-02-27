import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";

function Home() {
	return (
		<div className="home">
			<Header login={true} signup={true} />
		</div>
	);
}

export default Home;
