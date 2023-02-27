import React from 'react'
import './SignUp.css'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'

function SignUp() {
  return (
    <div className='signup'>
      <Header login={ true } signup={ false } />
    </div>
  )
}

export default SignUp