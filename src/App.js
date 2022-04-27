import './App.css';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("")
  const [newAge, setNewAge] = useState(0)
  const usersCollectionRef = collection(db, 'users');
  const [refresh, setRefresh] = useState(0);

  const createUser = async () => {
    const user = {
      name: newName,
      age: Number(newAge)
    }
    await addDoc(usersCollectionRef, user);
    setRefresh(refresh + 1);
  }

  const updateUser = async (id, age) => {
    const userDoc = doc(db, 'users', id);
    const newField = {
      age: age + 1
    }
    await updateDoc(userDoc, newField);
    setRefresh(refresh + 1);
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
    setRefresh(refresh + 1);
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    getUsers();
  }, [refresh]);
  return (
    <div className="App">
      <input type="text" placeholder="name..." onChange={(event) => {
        setNewName(event.target.value)
      }} />
      <input type="number" placeholder="age..." onChange={(event) => {
        setNewAge(event.target.value)
      }} />
      <button onClick={createUser}>Create</button>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1>{user.name}</h1>
            <p>{user.age}</p>
            <p>{user.id}</p>
            <button onClick={() => { updateUser(user.id, user.age) }}>Increase Age</button>
            <button onClick={() => { deleteUser(user.id) }}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
