import React, { useEffect, useState, useContext } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import {CurrentUserContext} from "../../context/CurrentUserContext";

function Login() {
  const { setCurrentUser } = useContext(CurrentUserContext);

  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ submit, setSubmit ] = useState( false );
  
  useEffect( () => {
    async function login() {
      const response = await fetch( "http://localhost:6060/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( { email, password } ),
      } );
      const data = await response.json();
      console.log( data );
      if( data.message === "User logged in successfully" ) {
        localStorage.setItem( "algorand_password_manager_token", email );
        setCurrentUser( email );
        console.log( "Logged in!" );
      } else {
        alert( "Error!" );
      }
    }
    if ( submit ) {
      login();
    }
  }, [submit])


  const handleEmailChange = ( event ) => {
    setEmail( event.target.value );
    console.log("Email: "+event.target.value)
  }

  const handlePasswordChange = ( event ) => {
    setPassword(event.target.value);
    console.log("Password: "+event.target.value)
  }

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setSubmit(!submit);
  }

	return (
		<div className="login">
			<Header login={false} signup={true} />
			<div className="login__container">
				<h1>Sign in</h1>
				<form className="login__container__form">
					<div className="login__container__part">
						<h5 className="login__container__label">E-mail:</h5>
						<input type="text" className="login__container__input" onChange={handleEmailChange} />
					</div>
					<div className="login__container__part">
						<h5 className="login__container__label">Password:</h5>
						<input type="password" className="login__container__input" onChange={handlePasswordChange}/>
					</div>
					<button type="submit" className="login__signInButton" onClick={handleSubmit}>
						Sign In
					</button>
				</form>
      </div>
      
		</div>
	);
}

export default Login;
