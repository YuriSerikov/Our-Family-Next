import { Metadata } from 'next'
import stl from './login.module.css'
import {SignInForm} from './SignInForm'

export const metadata: Metadata = {
  title: 'Login | Our Family'
}

export default function LoginPage() {
  

  return (
    <>
      <div className={stl.about}>
        <h2 className={stl.pagetitle}>Вход в программу и регистрация</h2>
        <div className={stl.row2}>
          <div className={stl.cardform}>
            <div className={stl.cardcontent}>
              <span className={stl.cardtitle}>Авторизация</span>
              <div className={stl.auth_area}>
                <SignInForm/>
              </div>
            </div>
          </div>
          <div className={stl.about_family}>
              Для регистрации:
              <ul>
                <li>нажмите кнопку "Регистрация" </li>
                <li>введите в соответствующие поля свой e-mail и <br /> пароль (не менее 6 символов) </li>
                <li>нажмите кнопку "Зарегистрироваться"</li>
                <li>зарегистрироваться можно /и нужно/ один раз. </li>
              </ul>  
                <br /> Для входа в программу
              <ul>
                <li>введите в соответствующие поля свой e-mail и пароль</li>
                <li>нажмите кнопку "Войти"</li>
              </ul>  
          </div>
        </div>
      </div>
    </>
  )
}
