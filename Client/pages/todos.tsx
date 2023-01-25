import { Button, Checkbox, Input, MenuItem, TextField, TextareaAutosize } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Swal from 'sweetalert2'
import styles from '../styles/Todos.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextRotationAngledownRounded } from '@mui/icons-material';
const URL = 'https://us-central1-apitodolistsergiodm92.cloudfunctions.net/server'

export default function Todos(){
  const router = useRouter()

    const [token, setToken] = useState('');
    const [todos, setTodos] = useState([]);
    const [todosDeleted, setTodosDeleted] = useState([]);
    const [copyTodos, setCopyTodos] = useState([]);
    const [email, setEmail] = useState('');
    const [reload, setReload] = useState(0);
    const [filter, setFilter] = useState('')
    const [sort, setSort] = useState('')

    useEffect(() => {
      setToken(sessionStorage.token)
      setEmail(sessionStorage.email)
      axios
          .get(`${URL}/todo/all&Deleted/${sessionStorage.email}`,{
            headers: {
            'auth-token': `${sessionStorage.token}`
          }
          })
          .then((response)=>{
            setCopyTodos(response.data.data.filter((t:{delete:boolean})=>t.delete===false))
            setTodosDeleted(response.data.data.filter((t:{delete:boolean})=>t.delete===true))
          })
          .catch((error)=>{
            console.log(error)
          })
    }, [reload]);

    useEffect(() => {
      axios
          .get(`${URL}/todo/all/${sessionStorage.email}`,{
            headers: {
            'auth-token': `${sessionStorage.token}`
          }
          })
          .then((response)=>{
            setTodos(response.data.data)

          })
          .catch((error)=>{
            console.log(error)
          })
    },[reload]);

    const handleClickCS = () =>{
      sessionStorage.setItem('token','')
      Swal.fire({
        title: '¿Estas seguro/a de cerrar sesion?',
        text: "Presione confirmar para cerrar sesion",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title:'¡Sesion finalizada correctamente!',
            confirmButtonColor: '#3085d6'
        })
        .catch(()=>{
          Swal.fire({
            icon: 'error',
            title:'¡Ocurrio un error!',
            text: 'Vuelva a intentarlo',
            confirmButtonColor: '#3085d6'
        })
        })
          router.push('/')
        }
      })
    }
    const handleSubmitTodo = (e: React.SyntheticEvent<HTMLFormElement>) =>{
      e.preventDefault();
      const target = e.target as typeof e.target & {
      text: { value: string };
      title: {value: string}
      };
      if(!target.text.value){
        Swal.fire({
          icon:'warning',
          title: 'Error',
          text:'El campo esta vacio, debe completarlo...',
          confirmButtonColor: '#3085d6'
        })
        return
      }
    const dataTodo:{id:string; title:string; text:string; date:number; delete: boolean; email: string; completed: boolean}={
      'id': Date.now().toString(),
      'title': target.title.value,
      'text': target.text.value,
      'email': email,
      'date': Date.now(),
      'delete': false,
      'completed': false
    }
    axios
        .post(`${URL}/todo/create`, dataTodo, {
          headers: {
          'auth-token': `${token}`
        }
        })
        .then(()=>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Tarea cargada correctamente',
            showConfirmButton: false,
            timer: 800
          })
          setReload(reload+1)
          target.title.value=''
          target.text.value=''
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
    const handleDelete = (e: React.MouseEvent<HTMLElement> ) =>{
      const target = e.target as typeof e.target & {
        id: { value: number };
        };
      const id = target.id.toString()
      Swal.fire({
        title: '¿Estas seguro/a de eliminar la tarea?',
        text: "Presione confirmar para eliminar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
          .put(`${URL}/todo/deleteTrue`,{id:id},{
            headers: {
            'auth-token': `${sessionStorage.token}`
          }
          })
          .then((response)=>{
            setReload(reload+1)
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
      })
   }
const handleResDelete = (e: React.MouseEvent<HTMLElement> ) =>{
  const target = e.target as typeof e.target & {
    id: { value: number };
    };
  const id = target.id.toString()
  Swal.fire({
    title: '¿Estas seguro/a de reestablecer la tarea?',
    text: "Presione confirmar para reestablecer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios
      .put(`${URL}/todo/deleteFalse`,{id:id},{
        headers: {
        'auth-token': `${sessionStorage.token}`
      }
      })
      .then(()=>{
        setReload(reload+1)
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
  })
  }
const handleDeleteForEver = (e: React.MouseEvent<HTMLElement> ) =>{
  const target = e.target as typeof e.target & {
    id: { value: number };
    };
  }
const handleEdit = (a:  {id: string; title: string; text: string; completed: boolean;} ) =>{
    const id = a.id
    const title = a.title
    const text = a.text
    Swal.fire({
        title: 'Editar Tarea',
        html:        
            `<input id="title" value="${title}" class="swal2-input">` +
            `<input id="text" value="${text}" class="swal2-input">`,
            
        focusConfirm: false,
        confirmButtonColor: '#3085d6',
        showCancelButton:true,
        cancelButtonColor: '#d33',
        preConfirm: () => {
          let newTitle: string = ''
          let newText: string = ''
          const input1 =  document.getElementById('title') as HTMLInputElement | null;
          if (input1 != null) {
            newTitle = input1.value
          }
          const input2 =  document.getElementById('text') as HTMLInputElement | null;
          if (input2 != null) {
            newText = input2.value
          }
          axios
              .put(`${URL}/todo/edit`,{id:id, title: newTitle, text: newText},{
                headers: {
                'auth-token': `${sessionStorage.token}`
              }
              })
              .then((response)=>{
                setReload(reload+1)
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Tarea editada correctamente',
                  showConfirmButton: false,
                  timer: 800
                })
              })
              .catch((error)=>{
                Swal.fire({
                  icon:'warning',
                  title: 'Error',
                  text:'Algo salio mal, vuelve a intentarlo...',
                  confirmButtonColor: '#3085d6'
                })
              })
              }
          })
        }
  const handleChecked = (e: React.MouseEvent<HTMLElement> ) =>{
    const target = e.target as typeof e.target & {
      id: { value: number };
      checked : {value : boolean}
      };
    const id = target.id.toString()
    const checked = target.checked
    axios
          .put(`${URL}/todo/completed`,{id:id, checked:checked},{
            headers: {
            'auth-token': `${sessionStorage.token}`
          }
          })
          .then((response)=>{
            setReload(reload+1)
            setCopyTodos(todos)
          })
          .catch((error)=>{
            Swal.fire({
              icon: 'error',
              title:'¡Ocurrio un error!',
              text: 'Vuelva a intentarlo',
              confirmButtonColor: '#3085d6'
          })
          })
    }
    const handleChangeFilter = (e: SelectChangeEvent) => {
      setFilter(e.target.value)
      if(e.target.value=="Todas"){setTodos(copyTodos)}
      if(e.target.value=="Completadas"){setTodos(copyTodos.filter((a:{completed:boolean})=>a.completed==true))}
      if(e.target.value=="Pendientes"){setTodos(copyTodos.filter((a:{completed:boolean})=>a.completed==false))}
      if(e.target.value=="Eliminadas"){setTodos(todosDeleted)}
      if(e.target.value=="a-z"){
        setSort(e.target.value)
        setTodos(copyTodos.sort(
        function(a:{title:string},b:{title:string}){
                                                      if(a.title.toLowerCase()>b.title.toLowerCase()){return 1}
                                                      if(a.title.toLowerCase()<b.title.toLowerCase()){return -1}
                                                      return 0}))}
        }
    const formatDate = (date:number)=>{
      const dateFormat= (new Date(date)).toLocaleDateString('es').replaceAll("/", "-")
      return dateFormat
    }
    return(
          <div className={styles.container}>
            <div className={styles.title}>
              <h1>☑️</h1>
              <h1 className={styles.titleUnder}>Lista de tareas</h1>
            </div>
            <form onSubmit={handleSubmitTodo} className={styles.formAdd}>
                <div className={styles.inputs}>
                  {/* <input sx={{marginLeft:'30px',width:'auto',height:'auto', fontSize:'12px'   }}  key= 'title' placeholder='Titulo de la tarea...' name='title' />
                  <input sx={{width:'auto', marginLeft:'30px',height:'auto', fontSize:'12px'}}  key= 'text' placeholder='Descripcion...' name='text' /> */}
                  <input maxLength={100} key= 'title' placeholder='Titulo de la tarea...' name='title'className={styles.inputTodo} />
                  <input maxLength={500} key= 'text' placeholder='Descripcion...' name='text' className={styles.inputTodo}/> 
                </div>
                <div>
                  <Button variant="contained" sx={{ height:'60px',fontSize:'12px'}} type='submit'>Agregar</Button>
                </div>
            </form>
            <div className={styles.filters}>
              <div className={styles.selects}>
                <p>Filtrar</p>
                <Select
                sx={{width:'120px', height:'40px', fontSize:'12px'}}
                labelId="demo-simple-select-label"
                id="select-filter"
                value={filter}
                label="Filtrado"
                onChange={handleChangeFilter}
                >
                  <MenuItem sx={{fontSize:'12px'}} value={"Todas"}>Todas</MenuItem>
                  <MenuItem sx={{fontSize:'12px'}} value={"Completadas"}>Completadas</MenuItem>
                  <MenuItem sx={{fontSize:'12px'}} value={"Pendientes"}>Pendientes</MenuItem>
                  <MenuItem sx={{fontSize:'12px'}} value={"Eliminadas"}>Eliminadas</MenuItem>
                </Select>
              </div>
              <div className={styles.selects}>
                <p>Ordenar</p>
                <Select
                sx={{width:'120px', height:'40px',fontSize:'12px'}}
                labelId="demo-simple-select-label"
                id="select-sort"
                value={sort}
                label="Age"
                onChange={handleChangeFilter}
                >
                  <MenuItem sx={{fontSize:'12px'}} value={"a-z"}>Nombre A-Z</MenuItem>
                </Select>
              </div>
            </div>
            <div className={styles.cards}>
            {todos.length?todos.map((a:{id:string; title:string; text:string; completed:boolean; date:number, delete:boolean})=>{
                return(
                  <div key={a.id} className={styles.card}>
                    <div className={styles.tasks}>
                      <div className={styles.check}>
                        <Checkbox checked={a.completed}  id={a.id} onClick={(e)=>handleChecked(e)}/>
                      </div>
                      <div className={styles.cardTexts}>
                        <div className={styles.cardTitle}>
                          <h4>{a.title}</h4>
                        </div>
                        <div className={styles.cardText}>
                          <p>{a.text}</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardEnd}>
                    {!a.delete?
                      <div className={styles.btnlist}>
                        <button onClick={()=>handleEdit(a)} className={styles.btnEdits}>✏️</button>
                        <button id={a.id}  onClick={(e)=>handleDelete(e)} className={styles.btnEdits}>🗑️</button>
                      </div>
                      :
                      <div className={styles.btnlist}>
                        <button id={a.id}  onClick={(e)=>handleResDelete(e)} className={styles.btnEdits}>♻️</button>
                        <button id={a.id}  onClick={(e)=>handleDeleteForEver(e)} className={styles.btnEdits}>🗑️</button>
                      </div>
                      }
                      <div className={styles.date}>
                        <p>{formatDate(a.date)}</p>
                      </div>
                    </div>
                  </div>
                )
            }
            ):null}
            </div>
            <div className={styles.close}>
              <Button onClick={handleClickCS}>Cerrar Sesion</Button>
            </div>
          </div>
        )
}



