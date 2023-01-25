import type { NextPage } from 'next'
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import styles from '../styles/Home.module.css'
import { Button } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import {useEffect} from 'react'
const URL = 'https://us-central1-apitodolistsergiodm92.cloudfunctions.net/server'


const Home: NextPage = () => {
  let user : {email:string; password:string} = {"email":"", "password":""}
  const router = useRouter()


  useEffect(() => {
    if(sessionStorage.token)router.push('/todos')
  }, [])
  

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) =>{
      e.preventDefault();
      
      const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value; 
    const password = target.password.value; 
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(email === '' || password === ''){
          Swal.fire({
            icon: 'warning',
            title:'Email o password vacios',
            text:'¡Debe completar todos los campos!',
            confirmButtonColor: '#3085d6'
        })
          return;
          }
        if(email !== '' && !emailRegex.test(email)){
          Swal.fire({
            icon: 'warning',
            title:'Email invalido',
            text:'Debe completar el email con el formato correcto!',
            confirmButtonColor: '#3085d6'
        })
          return;
        }
        user = {"email":email, "password":password}

          axios
            .post(`${URL}/user/login`,user)
            .then((response)=>{
              Swal.fire({
                icon: 'success',
                title:'¡Ingreso con éxito!',
                confirmButtonColor: '#3085d6'
            })
              sessionStorage.setItem('token',response.data.data)
              sessionStorage.setItem('email',email)
              router.push('/todos')
            })
            .catch((error)=>{
              if(error.message=='Network Error'){
                Swal.fire({
                  icon: 'error',
                  title:'error de conexión',
                  text:'vuelva a intentarlo...',
                  confirmButtonColor: '#3085d6'
                })
              }
              else Swal.fire({
                icon: 'error',
                title:'el email o contraseña invalido',
                text:'vuelva a intentarlo',
                confirmButtonColor: '#3085d6'
              })
            }
            )
          }
      
//Network Error
//message
  return (
    
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <h3>Email</h3>
        <TextField id="outlined-basic"  name="email" label="usuario@email.ejemplo" variant="outlined" />
        <br></br>
        <h3>Contraseña</h3>
        <TextField  id="outlined-basic" type='password' label="ingrese su contraseña" name='password' variant="outlined" />
        <br></br>
        <br></br>
        <Button variant="contained" color="success" type='submit' >Ingresar</Button>
      </form>
      <br></br>
      <br></br>
      <Link href={'/register'} ><h5 className={styles.register}> Resgistrate aquí</h5></Link>
    </div>
  )
}

export default Home
