import { Button, TextField } from '@mui/material';
import styles from '../styles/Home.module.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useRouter } from 'next/router';
import {useEffect} from 'react'
const URL = 'https://us-central1-apitodolistsergiodm92.cloudfunctions.net/server'

export default function Register(){

  const router = useRouter()
  useEffect(() => {
    if(sessionStorage.token)router.push('/todos')
  }, [])
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
        passwordRepeat: { value: string };
      };
      const email = target.email.value; 
      const password = target.password.value; 
      const passwordRepeat = target.passwordRepeat.value; 
      const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      const user: {email:string; password:string;} = {"email":email, "password":password}

          if(email === '' || password === ''){
            Swal.fire({
              icon:'warning',
              title:'su email o password estan vacios',
              text:'¡Debe completar todos los campos!',
              confirmButtonColor:'#3085d6'
              });
            return;
            }
          if(email !== '' && !emailRegex.test(email)){
            Swal.fire({
              icon:'warning',
              title:'El email es invalido',
              text:'¡Debe completar el email correctamente!',
              confirmButtonColor:'#3085d6'
              });
            return;
          }
          if(password !== passwordRepeat ){
            Swal.fire({
              icon:'warning',
              title:'Las contraseñas no coinciden',
              text:'Debe escribir la misma contraseña...',
              confirmButtonColor:'#3085d6'
              });
            return;
          }
          if(password.length<8){
            Swal.fire({
              icon:'warning',
              title:'No cumple la cantidad mínima ',
              text:'La contraseña debe tener entre 8 y 15 caracteres',
              confirmButtonColor:'#3085d6'
              });
            return;
          }
          console.log(URL)
          axios
                .post(`${URL}/user/register`,user)
                .then((response)=>{
                  Swal.fire({
                    icon:'success',
                    title:'Fue registrado con exito',
                    confirmButtonColor:'#3085d6',
                  })
                  router.push('/')
                })
                .catch(()=>{
                  Swal.fire({
                    icon: 'error',
                    title:'¡Ocurrio un error!',
                    text: 'Vuelva a intentarlo',
                    confirmButtonColor: '#3085d6'
                })
                })
    }  

    return( 
        <div className={styles.container}>
      <h1>Reistrarse</h1>
      <form onSubmit={handleSubmit}>
        <h4>Ingrese su Email</h4>
        <TextField id="outlined-basic" type='email' name="email" label="usuario@email.ejemplo" variant="outlined" />
        <h4>Ingrese su Contraseña</h4>
        <TextField id="outlined-basic" type='password' label="ingrese su contraseña" name='password' variant="outlined" />
        <h4>Repita su Contraseña</h4>
        <TextField id="outlined-basic" type='password' label="repita su contraseña" name='passwordRepeat' variant="outlined" />
        <br></br>
        <br></br>
        <Button variant="contained" color="success" type='submit' >Registrarse</Button>
      </form>
    </div>
        )
}