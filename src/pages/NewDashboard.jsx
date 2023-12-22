import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ToDoItem from "../components/ToDoItem";
import { changeToDoStatus, getUserToDoTags, getUserToDos, newUpdate } from "../firebase/db/todos";
import Button from "../components/Button"
import done_1 from "../assets/done_1.png"
import done_2 from "../assets/done_2.png"
import done_3 from "../assets/done_3.png"
import not_done_1 from "../assets/not_done_1.png"
import not_done_2 from "../assets/not_done_2.png"
import dayjs from "dayjs";
import { getUserNotes } from "../firebase/db/notes";


function NewDashboard(){

    const {id} = useParams();
    const [toDoItems, setToDoItems] = useState([]);
    const [doneImage, setDoneImage] = useState();
    const [notDoneImage, setNotDoneImage] = useState();
    const [doneCount, setDoneCount] = useState(0);
    const [notDoneCount, setNotDoneCount] = useState(0);
    const [itemsThisWeek, setItemsThisWeek] = useState();
    const [tags, setTags] = useState([])
    const [result, setResult] = useState([])
    const [notes, setNotes] = useState([])
    useEffect(() =>{
        updateToDoList()
        const randInt = Math.ceil(Math.random() * 3);
        setDoneImage(randInt===1 ? done_1 : randInt === 2 ? done_2 : done_3);
        setNotDoneImage(randInt === 1 ? not_done_1 : not_done_2);
        getUserToDoTags().then(r => setTags(r))
        getUserNotes().then((notes) => setNotes(Object.values(notes))).catch((err) => setNotes([]));
    },[])

    useEffect(() =>{
        setResult(toDoItems)
    },[toDoItems])
   
    useEffect(() => {
        setDoneCount(result.filter(item => item.status).length)
        setNotDoneCount(result.filter(item => !item.status).length)
        let count = 0;
        result.map(item => {
            if(item.status && dayjs().diff(dayjs(item.completed, "days")) <= 7 ){
                count++;
            }
        })
        setItemsThisWeek(count)
    }, [result])
    async function markDone(e, title){
        if(e.target.checked){
            await changeToDoStatus(title, true)
        }
        updateToDoList()
    }
  
    function updateToDoList(){
        getUserToDos().then(r =>{setToDoItems(r)}).catch(e => setToDoItems([]))
    }

    function filterItems(e){
        if(e.target.value === "0"){
            updateToDoList()
        }else{
            setResult(toDoItems.map(item => {
                console.log(item)
                if(Object.keys(item).includes("tag")){
                    const tag = Object.keys(item.tag)
                    console.log(tag)
                    if(tag[0] === e.target.value){
                        return item
                    }
                }
            }).filter(item => item !== undefined))
        }
    }
    return(
        <div className="container-fluid position-fixed p-0 h-100">
            <NavBar />
                <div className="row position-absolute mt-5 top-50 start-50 translate-middle border-box shadow border-2 gutter-x-0 overflow-y-scroll-sm" style={{height: "75vh", width: "80vw"}}>
                    
                    <div className="col-12 col-md-4 col-lg-3 mb-md-0 mb-5 ">


                        <div className="container py-4 position-relative border-bottom h-75 overflow-y-scroll" >
                            <h5 className="row gutter-x-0 justify-content-center bolder">
                                TO DO
                            </h5>
                            <div className="container-md">
                                {result.length > 0 && result.map(item => {
                                    if(!item.status){
                                        return <ToDoItem item={item} handleSelection={markDone} />
                                    }
                                })}
                                {result.filter(item => !item.status).length === 0 && (
                                    <div className="row justify-content-center text-center mt-5">
                                        <p>Nothing to do for now...</p>
                                        <Button label={"Go to tasks dashboard"} color={"light"} size={"small"} navigate={`/dashboard/${id}/todo`} classes="w-75 mt-2" />
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="container py-4 position-relative mb-lg-0">
                            <h5 className="row gutter-x-0 justify-content-center bolder">
                                filter by tag
                            </h5>
                            <div className="container-md">
                                <select onChange={(e) => filterItems(e)} className="form-select text-center">
                                    <option value={0}>All</option>
                                    {tags.length > 0 && tags.map(tag => {
                                        return <option value={tag.tagName}>{tag.tagName}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="row gutter-x-0 h-100 px-3">
                            <div className="col-12 text-center py-2">
                                <div className="row gutter-x-0 gutter-x-0 border-bottom  p-4">
                                    <img className="dashboard-img" src={doneImage} alt="" />
                                    <p className="col col-md-12 text-md-center text-start my-auto">You have {doneCount} completed tasks.</p>
                                </div>
                            </div>
                            <div className="col-12 py-2">
                                <div className="row gutter-x-0 align-items-center border-bottom  p-4">
                                    <img className="dashboard-img" src={notDoneImage} alt="" />
                                    <p className="col col-md-12 text-md-center text-start my-auto">You {notDoneCount !== 0 && `still`} have {notDoneCount} pending tasks.</p>
                                </div>
                            </div>
                            <div className="col-12 pt-5">
                                <div className="row gutter-x-0">
                                    <h4 className="text-center badge-text">{itemsThisWeek===0 ? "Don't give up" : "You did it"}</h4>
                                </div> 
                                <div className="row gutter-x-0">
                                    <p className="text-center">You have completed {itemsThisWeek} {itemsThisWeek > 1 || itemsThisWeek ===0 ? "tasks" : "task"} this week!</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-5 h-100 py-md-0 py-4">
                        <div className="container py-4 position-relative h-100 overflow-y-scroll" >
                            <h5 className="row gutter-x-0 justify-content-center bolder">
                                YOUR NOTES
                            </h5>
                            <div className="container">
                                <div className="row">
                                    {notes.length > 0 && notes.map((note, index) => {
                                        return (
                                            <div className="col-12 my-2" key={index}>
                                                <div className="card pointer-cursor">
                                                    <div className="card-body row gutter-x-0">
                                                        <div className="card-title row gutter-x-0 align-items-center">
                                                            <h5 className="col">{note.title.slice(0, 20)}</h5>
                                                        </div>
                                                        <p className="card-text col">{note.content.slice(0, 50)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {notes.length === 0 && (
                                        <div className="row m-auto justify-content-center text-center mt-5">
                                            <p className="">No notes yet...</p>
                                            <Button label={"Go to notes dashboard"} color={"light"} size={"small"} navigate={`/dashboard/${id}/notes`} classes="w-75 mt-2" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default NewDashboard;
