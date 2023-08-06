"use client"

import Link from 'next/link';
import './Navbar.css'
import logo from '../../images/logo/YS-40x39red.png'
import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '@/app/context/AuthContext'
import NavButtonExit from './NavBarButtonExit/NavButtonExit';

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [isActivated, setIsActivated] =useState(false)
  
  const auth = useContext(AuthContext)
  
  useEffect(() => {
    console.log('auth isAuthenticated =', auth.isAuthenticated)
    setIsActivated(auth.isAuthenticated)
  },[auth])
  
  const handleclick = () => {
    setClick((prev) => !prev)
  }
  const closeMobileMenu = () => {
    setClick(false)
  } 
  
  return (
    <>
      <header className='navbarApp'>
        <Link href="/" className="navbar-logo">
          <Image src={logo} alt='SYG'/>
        </Link>
        <div className='menu_icon' onClick={handleclick}>
          {click ?
            <FontAwesomeIcon icon={faTimes} />
            : <FontAwesomeIcon icon={faBars} />
          }
        </div>
        <div className={click ? 'nav-menu active' : 'nav-menu'}>
          {isActivated
            ? (
              <div>
                <Link href='/' className='nav_links' onClick={closeMobileMenu}>О программе</Link>
                <Link href='/commonList' className='nav_links' onClick={closeMobileMenu}>Список персон</Link>
                <Link href='/album' className='nav_links' onClick={closeMobileMenu}>Альбом</Link>
                <Link href='/familyTree' className='nav_links' onClick={closeMobileMenu}>Семейное дерево</Link>
              </div>
            )
            : (
              <div>
                <Link href='/' className='nav_links' onClick={closeMobileMenu}>О программе</Link>
                <Link href='/login' className='nav_links' onClick={closeMobileMenu}>Вход</Link>
                <Link href='/register' className='nav_links' onClick={closeMobileMenu}>Регистрация</Link>
              </div>
              )
            }
        </div>
        <div>
          {isActivated && <NavButtonExit/>} 
        </div>
      </header>
    </>
  );
};

export default Navbar;