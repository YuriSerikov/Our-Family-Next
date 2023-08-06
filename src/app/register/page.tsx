'use client'

import { Metadata } from 'next'
//import stl from '@/app/login/login.module.css'
import { useContext, useState } from 'react';
import { useRouter } from "next/navigation";
import { useHttp } from '@/app/Hooks/httpHook';
import MessageHook from "@/app/Hooks/MessageHook";
import AuthContext from "@/app/context/AuthContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";

export const metadata: Metadata = {
  title: 'Register | Our Family'
}

export default function RegisterPage() {
  const { loading, request, error, clearError } = useHttp();

  const [showRegister, setShowRegister] = useState(true);
  const [message, setMessage] = useState("");
  const [formReg, setFormReg] = useState({
    email: "",
    password: "",
  });
  const router = useRouter()
  const auth = useContext(AuthContext);

  const changeHandlerReg = (event:React.ChangeEvent<HTMLInputElement>) => {
    const em = event.target.value;
    const fild = event.target.name;
    const val = fild === "password_reg" ? em : em.toLowerCase();
    setFormReg({ ...formReg, [event.target.name]: val });
    if (!val) {
      event.target.style.borderColor = "red";
    } else {
      event.target.style.borderColor = "grey";
    }
  };

  const registerRequest = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...formReg });
      
      setMessage(data.message);
       
      if (data.email === formReg.email) {
        setMessage("Успешная регистрация");
        setFormReg({ email: "", password: "" });
        router.push("/login");
      } else if (data.email === "exists") {
        setMessage(`Регистрация не исполнена. ${formReg.email} уже зарегистрирован`);
        router.push("/");
      }
    } catch {
      setMessage("Ошибка при исполнении запроса на регистрацию: ");
      router.push("/");
    }
  };

  const registerHandler = () => {
   
    const elemInputMail = document.getElementById("email_reg") as HTMLInputElement
    const elemInputPass = document.getElementById("password_reg") as HTMLInputElement

    if (elemInputMail.value && elemInputPass.value) {
      registerRequest();

    } else if (!(elemInputMail.value)) {
      setMessage("Заполните поле < Email >");
      elemInputMail.focus()
      
    } else if (elemInputMail.value && !elemInputPass.value) {
      setMessage("Заполните поле < Пароль >");
      
      elemInputPass.focus();
    } else {
      setMessage("Заполните поля ввода в форме");
      
      elemInputMail.focus();
    }
  };

  const handleClose = () => {
    setShowRegister(false)
    router.push('/')
  }

  return (
    <>
      <div>
        <Modal
          show={true}     //{showRegister}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Регистрация</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={registerHandler}>
              <Form.Group className="mb-3" controlId="email_reg">
                <Form.FloatingLabel
                  label="Ваш эл.адрес"
                  className="mb-3" >
                  <Form.Control
                    id="email_reg"
                    name="email"
                    type="email"
                    placeholder="Введите email..."
                    autoFocus
                    onChange={changeHandlerReg}
                  />
                </Form.FloatingLabel>  
              </Form.Group>
              <Form.Group className="mb-3" controlId="password_reg">
                <Form.FloatingLabel
                  label="Введите пароль"
                  className="mb-3" >
                  <Form.Control
                    id="password_reg"
                    name="password"
                    type="password"
                    placeholder="Введите пароль..."
                    autoFocus
                    onChange={changeHandlerReg}
                  />
                </Form.FloatingLabel>   
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
            <Button type='submit' variant="primary" onClick={registerHandler}>
              Зарегистрироваться
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <MessageHook page={"Авторизация"} variant={"warning"}>
          {message}
        </MessageHook>
      </div>
    </>
  )
}