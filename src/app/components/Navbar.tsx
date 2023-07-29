"use client"

import Link from 'next/link';
import './Navbar.css'
import logo from '../../images/logo/YS-40x39red.png'
import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import { PersonContext } from '@/app/context/PersonContext'
import AuthContext from '@/app/context/AuthContext'
import NavButtonExit from './NavBarButtonExit/NavButtonExit';

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [isActivated, setIsActivated] =useState(false)
  
  const personId = useContext(PersonContext)
  //const path = (personId) ? `/personInfo/${personId.personLongname}` : '/commonList'
  const auth = useContext(AuthContext)
  useEffect(() => {
    console.log('auth =',auth.isAuthenticated)
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
          <Link href='/' className='nav_links' onClick={closeMobileMenu}>О программе</Link>
          {isActivated && <Link href='/commonList' className='nav_links' onClick={closeMobileMenu}>Список персон</Link>}
          {isActivated && <Link href='/album' className='nav_links' onClick={closeMobileMenu}>Альбом</Link>}
          {isActivated && <Link href='/familyTree' className='nav_links' onClick={closeMobileMenu}>Семейное дерево</Link>}
          {!isActivated && <Link href='/login' className='nav_links' onClick={closeMobileMenu}>Вход</Link>}
          {!isActivated && <Link href='/register' className='nav_links' onClick={closeMobileMenu}>Регистрация</Link>}
        </div>
        <div>
          {isActivated && <NavButtonExit/>} 
        </div>
      </header>
    </>
  );
};

export default Navbar;