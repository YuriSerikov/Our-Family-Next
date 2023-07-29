
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthContext from '../../context/AuthContext'
import stl from './NavButtonExit.module.css'

const NavButton = () => {
  const navigate = useRouter()
  const auth = useContext(AuthContext)

  const logoutHandler = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    auth.logout()
    navigate.push('/')
  }

  return (
    <Link href="/">
      <button className={stl.btnLogout} onClick={logoutHandler}>
        Выход
      </button>
    </Link>
  )
}

export default NavButton
