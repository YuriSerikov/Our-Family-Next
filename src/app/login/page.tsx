'use client'

import { Metadata } from 'next'
import stl from './login.module.css'
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import MessageHook from "../Hooks/MessageHook";
import { useHttp } from '../Hooks/httpHook';
import AuthContext from "../context/AuthContext";

export const metadata: Metadata = {
  title: 'Login | Our Family'
}

export default function LoginPage() {
  const { loading, request, error, clearError } = useHttp();
  
  const [form, setForm] = useState({
      email: "",
      password: "",
  });
  const [message, setMessage] = useState("");
  
  const router = useRouter()
  const auth = useContext(AuthContext);
  console.log('auth.isAuthenticated',auth.isAuthenticated)

  useEffect(() => {
      if (error) {
          setMessage(error);
      }
    
    setTimeout(() => clearError(), 3000);
  }, [error, clearError]);
 
  const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
      const em = event.target.value;
      const fild = event.target.name;
      const val = fild === "password" ? em : em.toLowerCase();
      setForm({ ...form, [event.target.name]: val });
      if (!val) {
        event.target.style.borderColor = "red";
      } else {
        event.target.style.borderColor = "grey";
      }
  };

  const loginRequest = async () => {
    try {
      console.log('loginRequest')
      const data = await request("/api/auth/login", "POST", { ...form });

      let isAdminLogin = data.user.role === "admin" ? true : false;

      if (data.user.isActivated) {
        auth.login(data.accessToken, data.user.id, isAdminLogin);
        setMessage("Успешная авторизация");
        setForm({ email: "", password: "" });
        router.push("/commonList");
      } else {
        setMessage(`Почтовый адрес ${form.email} не подтвержден.`);
      }

      const dataUser:{accessToken: string, userId:any , isActivated:boolean} = {accessToken: data?.accessToken, userId: data?.user.id, isActivated: data?.user.isActivated}
      console.log(dataUser)
      return dataUser

    } catch (e: any) {
      console.log(e.message);
    }
  };
  
  const loginHandler = async () => {
    
    const elemInputMail = document.getElementById("email") as HTMLInputElement
    const elemInputPass = document.getElementById("password") as HTMLInputElement

    if (form.email && form.password) {

      const dataUser: {accessToken:string, userId: any, isActivated: boolean}|undefined = await loginRequest();

    } else if (!form.email) {
      setMessage("Заполните поле < Email >");
       
      elemInputMail.focus();
    } else if (form.email && !form.password) {
      setMessage("Заполните поле < Пароль >");
       
      elemInputPass.focus();
    } else {
      setMessage("Заполните поля ввода в форме");
       
      elemInputMail.focus();
    }
  };

  

  return (
    <>
      <div className={stl.about}>
        <h2 className={stl.pagetitle}>Вход в программу и регистрация</h2>
        <div className={stl.row2}>
          <div className={stl.cardform}>
            <div className={stl.cardcontent}>
              <span className={stl.cardtitle}>Авторизация</span>
              <div className={stl.auth_area}>
                <form onSubmit={loginHandler}>
                  <div className={stl.inputfield}>
                    <label htmlFor="email" className={stl.registrationlable}>
                      Email:
                    </label>
                    <input
                      className={stl.registrationinput}
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Введите email"
                      value={form.email}
                      onChange={(e) => changeHandler(e)}
                    />
                  </div>

                  <div className={stl.inputfield}>
                    <label htmlFor="password" className={stl.registrationlable}>
                      Пароль:
                    </label>
                    <input
                      className={stl.registrationinput}
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Введите пароль"
                      value={form.password}
                      onChange={changeHandler}
                    />
                  </div>
                  <div className={stl.btnArea}>
                    <button
                      type='submit'
                      className={stl.btnyellow}
                      disabled={loading}
                      onClick={loginHandler}
                      >
                        Войти
                    </button>
                  </div>
                </form>
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
      <div>
        <MessageHook page={"Авторизация"} variant={"warning"}>
          {message}
        </MessageHook>
      </div>
    </>
  )
}
