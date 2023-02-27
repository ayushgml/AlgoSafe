import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/signup" element={ <SignUp /> } />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
