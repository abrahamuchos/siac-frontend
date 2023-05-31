import React from 'react';
import { Button } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import { useUserContext } from "../contexts/UserProvider.jsx";

/**
 * Navigation component
 * @param {Array.<Object>} modules
 * @param {string} modules.title
 * @param {string} modules.route
 * @param user
 * @param {int} user.id
 * @param {string} user.email
 * @param {string} user.firstName
 * @param {string} user.firstSurname
 * @param {string} user.gradeType
 * @param user.medicalUnit
 * @param {int|null} user.medicalUnit.id
 * @param {string|null} user.medicalUnit.name
 * @param user.role
 * @param {int} user.role.id
 * @param {string} user.role.name
 * @param {string} user.avatar
 * @return {JSX.Element}
 * @constructor
 */
export default function Navigation({modules, user}) {
  const {setToken, setUser} = useUserContext();
  /**
   * Logout user
   */
  const handleLogout = () => {
    axiosClient.get('/logout')
      .then(() => {
        setToken(false);
        setUser({});
      })
      .catch((err) => {
        console.error(err);
      })
  }

  return (<nav id='navbar' className="d-flex flex-column flex-shrink-0 p-3 bg-white">
    <a href="/"
       className="d-flex align-items-center justify-content-center mb-3 mt-3 mb-md-0 link-dark text-decoration-none">
      <h1>Logo</h1>
    </a>
    <ul className="nav nav-pills flex-column mb-auto">
      {modules.map((item, index) => {
        return (<li className="nav-item mb-4" key={index}>
          <a href={item.route} className="nav-link text-md-center active" aria-current="page">
            {item.title}
          </a>
        </li>)
      })}
    </ul>

    <div className='d-flex flex-column justify-content-center align-items-center'>
      <a href="/#">
        <img src="https://placehold.co/100X100?text=U" alt="avatar" className="rounded-circle"/>
      </a>
      <div className="nav-name text-center">
        {user.role.id === 2 ? <a href='/#'>{user.firstName}</a> :
          <a href='/#'>{user.gradeType + ' ' + user.firstSurname}</a>}
        <br/>
        {user.medicalUnit ? <small className='text-muted'>{user.medicalUnit.name}</small> : ''}
      </div>
    </div>

    <div className='text-center mt-2 nav-logout'>
      <Button onClick={handleLogout} variant='tertiary'>Cerrar sesión</Button>
    </div>
  </nav>);
}