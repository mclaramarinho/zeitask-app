import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { getUserToDos, changeToDoStatus } from "../firebase/db";
import notDone from '../assets/not-done.jpg'
import { Checkbox, FormControlLabel } from "@mui/material";
import Loader from "../components/Loader";
function Dashboard(){
    const {id} = useParams();

    const [overview, setOverview] = useState(true);
    const [toDoS, setToDoS] = useState(false);
    const [todoList, setTodoList] = useState([]);
    const [doneItems, setDoneItems] = useState([]);
    const [pendingItems, setPendingItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
  
    function handleBtn(e){
        const value = e.target.value;
        if(value === "overview"){
            setOverview(true);
            setToDoS(false);
        }else{
            setOverview(false);
            setToDoS(true);
        }
    }

    useEffect(() =>{
        handleUpdate()
    }, [])
    useEffect(() => {
        categorizeToDoItems()
    }, [todoList])

    async function categorizeToDoItems(){
        setPendingItems(todoList.filter(item => item.status === false));
        setDoneItems(todoList.filter(item => item.status === true));
        setTimeout(() => {
            setIsLoading(false)
        }, (1000));
        
    }
    function removeDoneItem(title){
        changeToDoStatus(title, true)
        handleUpdate()
    }

    function handleUpdate(){
        setIsLoading(true)
        getUserToDos(id)
            .then( v =>{
                setTodoList(v)
            })
            .catch(err => {
                setTodoList([])
            })
    }

    return (
        <div className="container-fluid p-0">
            <NavBar/>
            <div className="container position-fixed top-50 start-50 translate-middle h-75">
                <div className="row gutter-x-0 position-relative top-50 start-50 translate-middle h-75">
                    <div className="col-12 col-md-4 mb-4 mb-md-0">
                        <div className="row gutter-x-0 position-relative top-50 start-50 translate-middle">
                            <div className="col-12 col-sm-10 col-md-8 text-center m-auto ">
                                <Button value={"overview"} color="black" label="OVERVIEW" size="medium" action={handleBtn} classes="row w-75 justify-content-center m-auto mt-2" />
                                <Button value={"toDos"} color="black" label="TO DO'S" size="medium" action={handleBtn} classes="row w-75 justify-content-center m-auto mt-2" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6 m-auto">
                        
                        <div className="row gutter-x-0">
                            <div className="col-12 col-sm-11 col-md-6 m-auto">
                                
                                {isLoading && <div className="row text-center"><Loader /></div> }

                                {/* DISPLAY OVERVIEW */}
                                {overview && !isLoading &&
                                    <div className="row text-center">
                                        <div className="row gutter-x-0 text-center mb-5">
                                            <img src={notDone} alt="" className="w-25 m-auto"/>
                                            <h4>You have {pendingItems.length} uncompleted tasks</h4>
                                        </div>
                                        <div className="row gutter-x-0 text-center mb-5">
                                            <img src={notDone} alt="" className="w-25 m-auto"/>
                                            <h4>You have {doneItems.length} completed tasks</h4>
                                        </div>
                                        
                                        <div className="row gutter-x-0 text-center">
                                            <img src={notDone} alt="" className="w-25 m-auto"/>
                                            <h4>You completed X tasks this week</h4>
                                        </div>
                                    </div>
                                }
                                

                                {/* DISPLAY TO DOs */}
                                {toDoS && !isLoading &&
                                    <div className="row gutter-x-0">
                                        <h4 className="text-center">Uncompleted Tasks</h4>
                                        <ul className="row gutter-x-0">
                                            {pendingItems.length > 0 ? pendingItems.map(item => {
                                                return <FormControlLabel className="m-auto border-box position-relative" control={<Checkbox />} label={item.title} onChange={() => removeDoneItem(item.title)} />
                                            }) : <h5 className="text-center">Nothing to show here</h5>}
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard;