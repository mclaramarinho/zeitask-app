import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ToDoItem from "../components/ToDoItem";
import { changeToDoStatus, getUserToDos } from "../firebase/db/todos";
import Button from "../components/Button"
import done_1 from "../assets/done_1.png"
import done_2 from "../assets/done_2.png"
import done_3 from "../assets/done_3.png"
import not_done_1 from "../assets/not_done_1.png"
import not_done_2 from "../assets/not_done_2.png"
import dayjs from "dayjs";


function NewDashboard(){
    const {id} = useParams();
    const [toDoItems, setToDoItems] = useState([]);
    const [doneImage, setDoneImage] = useState();
    const [notDoneImage, setNotDoneImage] = useState();
    const [doneCount, setDoneCount] = useState(0);
    const [notDoneCount, setNotDoneCount] = useState(0);
    const [itemsThisWeek, setItemsThisWeek] = useState();

    useEffect(() =>{
        updateToDoList()
        const randInt = Math.ceil(Math.random() * 3);
        setDoneImage(randInt===1 ? done_1 : randInt === 2 ? done_2 : done_3);
        setNotDoneImage(randInt === 1 ? not_done_1 : not_done_2);
    },[])

    useEffect(() =>{
        setDoneCount(toDoItems.filter(item => item.status).length)
        setNotDoneCount(toDoItems.filter(item => !item.status).length)

        let count = 0;
        toDoItems.map(item => {
            if(item.status && dayjs().diff(dayjs(item.completed, "days")) <= 7 ){
                count++;
            }
        })
        setItemsThisWeek(count)
    },[toDoItems])
   
    async function markDone(e, title){
        if(e.target.checked){
            await changeToDoStatus(title, true)
        }
        updateToDoList()
    }
    async function markNotDone(e, title){
        if(e.target.checked){
            await changeToDoStatus(title, false)
        }
        updateToDoList()
    }
    function updateToDoList(){
        getUserToDos().then(r =>{setToDoItems(r)}).catch(e => setToDoItems([]))
    }

    return(
        <div className="container-fluid position-fixed p-0 h-100">
            <NavBar />
            <div className="container w-75 p-0 position-absolute bottom-0 translate-middle-x start-50 end-50 overflow-y-scroll p-2" style={{height: "85vh"}}>
                <div className="row gutter-x-0 position-relative top-50 translate-middle-y border-2 shadow   overflow-y-scroll overflow-x-hidden dashboard-container">
                    
                    <div className="col-12 col-md-4 col-lg-3">


                        <div className="container py-4 position-relative h-50 border-bottom">
                            <h5 className="row gutter-x-0 justify-content-center bolder">
                                TO DO
                            </h5>
                            <div className="container-md">
                                {toDoItems.length > 0 && toDoItems.map(item => {
                                    if(!item.status){
                                        return <ToDoItem item={item} handleSelection={markDone} />
                                    }
                                })}
                                {toDoItems.filter(item => !item.status).length === 0 && (
                                    <div className="row justify-content-center text-center mt-5">
                                        <p>Nothing to do for now...</p>
                                        <Button label={"Go to tasks dashboard"} color={"light"} size={"small"} navigate={`/dashboard/${id}/todo`} classes="w-75 mt-2" />
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="container py-4 position-relative h-50">
                            <h5 className="row gutter-x-0 justify-content-center bolder">
                                DONE
                            </h5>
                            <div className="container-md">
                                {toDoItems.length > 0 && toDoItems.map(item => {
                                    if(item.status){
                                        return <ToDoItem completed item={item} handleSelection={markNotDone} />
                                    }
                                })}
                                {toDoItems.filter(item => item.status).length === 0 && (
                                    <div className="row gutter-x-0 justify-content-center text-center mt-5">
                                        <p>How about completing some tasks?</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="row gutter-x-0 h-100 px-3">
                            <div className="col-12 text-center">
                                <div className="row gutter-x-0 gutter-x-0 border-bottom  p-4">
                                    <img className="dashboard-img" src={doneImage} alt="" />
                                    <p className="col col-md-12 text-md-center text-start my-auto">You have {doneCount} completed tasks.</p>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row gutter-x-0 align-items-center border-bottom  p-4">
                                    <img className="dashboard-img" src={notDoneImage} alt="" />
                                    <p className="col col-md-12 text-md-center text-start my-auto">You {notDoneCount !== 0 && `still`} have {notDoneCount} pending tasks.</p>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row gutter-x-0">
                                    <h4 className="text-center badge-text">{itemsThisWeek===0 ? "Don't give up" : "You did it"}</h4>
                                </div> 
                                <div className="row gutter-x-0">
                                    <p className="text-center">You have completed {itemsThisWeek} {itemsThisWeek > 1 || itemsThisWeek ===0 ? "tasks" : "task"} this week!</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-5"></div>
                </div>
            </div>
        </div>
    )
}

export default NewDashboard;
