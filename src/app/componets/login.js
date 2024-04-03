'use client';

import { XANO_DB_URL } from '@/helpers/consts';
import {useState} from "react";
import axios  from 'axios';
import { useCookies } from 'next-client-cookies';


export const Login = () => {
  const loginUrl = `${XANO_DB_URL}/auth/login`;
  const [emailValue, setEmailValue]  = useState('');
  const [passwordValue, setPasswordValue]  = useState('');
  const [error, setError]  = useState(null);
  const cookies = useCookies();

  async function onSubmit () {
    try {
      setError(null);
      cookies.remove('token');
      console.log('emailValue', emailValue);

      const result = await axios.post(loginUrl, {
        "email": emailValue,
        "password": passwordValue
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result && result.data) {
        cookies.set('token', result.data.authToken);
        document.location.reload()
      }
    } catch (e) {
      console.error(e);
      setError('Неправильные данные');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-white mt-2">Email</p>
      <input
        className="text-black	mt-2"
        type="email"
        name="email"
        placeholder="Email"
        value={emailValue}
        onChange={(event) => {setEmailValue(event.target.value)}}
      />
      <p className="text-white mt-2">Пароль</p>
      <input
        className="text-black mt-2"
        type="text"
        name="password"
        placeholder="Пароль"
        value={passwordValue}
        onChange={(event) => {setPasswordValue(event.target.value)}}
      />
      <button className="bg-lime-700	mt-2" type="submit" onClick={onSubmit}>Войти</button>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  )
}
