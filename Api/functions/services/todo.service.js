const { db } = require('../db');

const postTodo = async (todo) => {
    try {
        await db.collection("Todos").doc(todo.id).set(todo)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
}

const getAllTodoByEmail = async (email) => {
    try {
        let todos = await db.collection('Todos').where("email","==",email).get()
        let alltoDos = await todos.docs.filter(a=>a.data().delete==false)
        return (alltoDos.map(a=>a.data()))
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const getAll = async (email) => {
    try {
        let todos = await db.collection('Todos').where("email","==",email).get()
        let alltoDos = await todos.docs
        return (alltoDos.map(a=>a.data()))
    }
    catch (error) {
        console.log(error);
        return false;
    }
}


const putDeleteTodoTrue = async (id) => {
    try {
        await db.collection("Todos").doc(id).set({delete:true},{merge: true})
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const putCompletedTrue = async (id,checked) => {
    try {
        await db.collection("Todos").doc(id).set({completed:checked},{merge: true})
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


const putDeleteTodoFalse = async (id) => {
    try {
        await db.collection("Todos").doc(id).set({delete:false},{merge: true})
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const editTodo = async (id, title, text) => {
    try {
        await db.collection("Todos").doc(id).set({title:title, text:text},{merge: true})
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


module.exports = {
    postTodo,
    getAllTodoByEmail,
    getAll,
    putDeleteTodoTrue,
    putDeleteTodoFalse,
    editTodo,
    putCompletedTrue
};