import { Button, InputAdornment, TextField } from '@mui/material';
import styles from '../styles/Home.module.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const URL = 'https://us-central1-apitodolistsergiodm92.cloudfunctions.net/server'


export default function Register(){

  const router = useRouter()
  const [values, setValues] = useState({
    showPassword: false
  })
  const handleClickShowPassword = ()=>{
      setValues({
          ...values,
          showPassword: !values.showPassword
      })
  }
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLElement>)=>{
      e.preventDefault()
  }
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
          .catch((error)=>{
            if(error.response.data.message=="user already exists"){
              Swal.fire({
                icon:'warning',
                title:'El correo ya existe ',
                text:'Debe ingresar un correo que no este registrado',
                confirmButtonColor:'#3085d6'
                });
            }
            else{Swal.fire({
              icon: 'error',
              title:'¡Ocurrio un error!',
              text: 'Vuelva a intentarlo',
              confirmButtonColor: '#3085d6'
          })}
          })
    }  

    return( 
        <div className={styles.container}>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit}>
        <h4>Ingrese su Email</h4>
        <TextField id="outlined-basic" type='email' name="email" sx={{width:'250px'}} label="usuario@email.ejemplo" variant="outlined" />
        <h4>Ingrese su Contraseña</h4>
        {/* <TextField id="outlined-basic" type='password' label="ingrese su contraseña" name='password' variant="outlined" /> */}
        <TextField
            name= 'password'
            type={values.showPassword?'text':'password'}
            label='Password'
            sx={{width:'250px'}}
            InputProps={{
                endAdornment:(
                    <InputAdornment position = "end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                            {values.showPassword ?
                            <VisibilityOff />
                            : <Visibility />
                            }
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
        <h4>Repita su Contraseña</h4>
        {/* <TextField id="outlined-basic" type='password' label="repita su contraseña" name='passwordRepeat' variant="outlined" /> */}
        <TextField
            name= 'passwordRepeat'
            type={values.showPassword?'text':'password'}
            label='Password'
            sx={{width:'250px'}}
            InputProps={{
                endAdornment:(
                    <InputAdornment position = "end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                            {values.showPassword ?
                            <VisibilityOff />
                            : <Visibility />
                            }
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
        <br></br>
        <br></br>
        <Button variant="contained" color="success" type='submit' >Registrarse</Button>
      </form>
    </div>
        )
}