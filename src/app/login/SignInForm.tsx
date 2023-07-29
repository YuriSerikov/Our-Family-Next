'use client'

import stl from './login.module.css'
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import MessageHook from "../Hooks/MessageHook";
import { useHttp } from '../Hooks/httpHook';
import AuthContext from "../context/AuthContext";

export const SignInForm = () => {

  const { loading, request, error, clearError } = useHttp();
  
  const [form, setForm] = useState({
      email: "",
      password: "",
  });
  const [message, setMessage] = useState("");
  
  const router = useRouter()
  const auth = useContext(AuthContext);
  //console.log(auth)

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

  
  const loginHandler = () => {
  
    const elemInputMail = document.getElementById("email") as HTMLInputElement
    const elemInputPass = document.getElementById("password") as HTMLInputElement

    if (form.email && form.password) {

      loginRequest();

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

  

  const loginRequest = async () => {
    try {
       
      const data = await request("/api/auth/login", "POST", { ...form });
      console.log(data)
      
      let isAdminLogin = data.user.role === "admin" ? true : false;

      if (data.user.isActivated) {

        auth.login(data.accessToken, data.user.id, isAdminLogin);
        setMessage("Успешная авторизация");
        setForm({ email: "", password: "" });
        router.push("/CommonList");
      } else {
        setMessage(`Почтовый адрес ${form.email} не подтвержден.`);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const gotoRegister = () => {
    console.log('/login/register')
    router.push('/login/register')
  }

  return (
    <>
      <form >
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
              className={stl.btnyellow}
              // disabled={loading}
              onClick={loginHandler}
            >
              Войти
          </button>
         {/*  <button
            className={stl.btngrey}
            onClick={ gotoRegister }
            disabled={auth.isAuthenticated}
            >
            Регистрация
          </button> */}
          </div>
      </form>
      <div>
        <MessageHook page={"Авторизация"} variant={"warning"}>
          {message}
        </MessageHook>
      </div>

      
    </>
  )
}