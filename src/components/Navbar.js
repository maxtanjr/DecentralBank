import React, {useEffect, useState, Fragment} from 'react';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
import BankPng from '../bank.png'

const Navbar = (props) => {

    return(
        <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
            <a className='navbar-brand col-sm-3 col-md-2 mr-0' style={{color:'white'}}>
                    <img src={BankPng} style={{width:'50px', height:'30px', marginRight:'5px', backgroundColor:'transparent'}} className='d-inline-block align-top'/>
                    Dapp Yield Staking (Decentralized Banking)
            </a>
            <ul className='navbar-nav px-3'>
                <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                    <small className='mr-4'
                    style={{color:'white'}}>ACCOUNT NUMBER: {props.account}</small>
                </li>
            </ul>

        </nav>
    )
}
export default Navbar;