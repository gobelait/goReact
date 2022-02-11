import React, {ChangeEvent, Component, CSSProperties, ReactNode} from "react";
import axios from "axios";
import {Header, Form, Icon, Input, Card} from "semantic-ui-react";
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";


let endpoint = "http://localhost:9000";

interface StateType {
    task: string;
    items: Array<string>;
    errorMessage: string;
}

interface PropsType {
    prop: any
}

class TodoList extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);

        this.state = {
            task: "",
            items: [],
            errorMessage: "",
        };
        

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }



    getTask= ()=> {
        axios.get(endpoint + "/api/task").then((res)=>{
            if (res.data) {
                this.setState({
                    items : res.data.map((item: any) => {

                        let isDone = item.status;
                        let iconUndoRedo;
                        if (!isDone) { //status : false
                            iconUndoRedo = 
                            <div > 
                                <Icon onClick={() => this.undoTask(item._id)}                      
                                name="check circle"
                                color="green"
                                />    
                                <span onClick={() => this.undoTask(item._id)} style={{paddingRight: 10}}>Done</span>
                            </div>
                        
                        } else { //status : true
                            iconUndoRedo =
                            <div >
                                <Icon onClick={() => this.redoTask(item._id)}                      
                                name="check circle outline"
                                color="red"
                                />    
                                <span onClick={() => this.redoTask(item._id)} style={{paddingRight: 10}}>Undone</span>
                            </div>                        
                        }

                        let coloring : SemanticCOLORS = 'yellow'
                        let style: CSSProperties = {
                            wordWrap: "break-word",
                        };
                        if (item.status) {
                            coloring ='green';
                            style = {
                                ...style, textDecorationLine: "line-through",
                            }
                            style["textDecorationLine"] = "line-through";
                        } else {
                            coloring ='red';
                            style = {
                                ...style, textDecorationLine: "none",
                            }
                            style["textDecorationLine"] = "none";
                        }
                        return (
                            <Card key={item._id} color={coloring} fluid className="rough">
                                {/* TODO : passer le card.header en input quand dblClick */}
                                <Card.Content onDoubleClick={() => this.updateTask(item)}>
                                    <Card.Header textAlign="left">
                                        <div style={style}>{item.task}</div>
                                    </Card.Header>

                                    <Card.Meta textAlign="right">

                                        {/* changement du bouton en fonction de l'etat */}
                                        {iconUndoRedo} 
                                        <Icon onClick={()=> this.deleteTask(item._id)}
                                        name="delete"
                                        color="red"
                                        />
                                        <span onClick={()=> this.deleteTask(item._id)} style={{paddingRight: 10}}>Delete</span>

                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        );
                    }),
                });
            } else {
                this.setState({
                    items:[],
                });
            }
        });
    }

    componentDidMount() {
        this.getTask();
    }

    onSubmit = () => { // creation d'une tache
        let {task} = this.state

        if (task) {
            axios.post(endpoint + "/api/task", 
                {task,},
                {headers: {
                    "Content-Type": "application/x-wwww-form-urlencoded",
                },
            }).then((res) => {
                this.getTask();
                this.setState({
                    task:"",
                });
                console.log(res);
            });
        }
    }

    onChange =  (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            task : event.target.value,
        });
    }

    updateTask(task: any) {

        // TODO: recuperer info (task) et faire passer dans la requete PUT
        console.log("item dans update : " + task.task )
        let newTask = {
            ID: task.id,
            task: "UPDATED",
            status: task.status,
        }

        axios.put(endpoint + "/api/task/" + newTask, {
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
            },
        } ).then((res)=>{
            console.log(res);
            this.getTask();
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
    }

    undoTask= (id: number) => {
        axios.put(endpoint + "/api/undoTask/" + id, {
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        })
    }

    redoTask= (id: number) => {
        axios.put(endpoint + "/api/redoTask/" + id, {
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        })
    }

    deleteTask(id: number) {
        axios.delete(endpoint + "/api/deleteTask/" + id, {
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();  
        })
    }


    deleteAllTasks() {
        axios.delete(endpoint + "/api/deleteAllTasks", {
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();  
        })
    }

    render (): ReactNode {
        let btnDeleteAll; // affichage du btn ssi au moins 1 item 
        if (this.state.items.length > 0 ) {
            btnDeleteAll = 
                <span onClick={()=> this.deleteAllTasks()}>   
                    <Icon                       
                    name="times"
                    color="black"
                    />
                    Delete all tasks
                </span>
        } else {
            btnDeleteAll = <span></span>
        }

        let divError; // affichage de la div erreur ssi erreur existe
        if (this.state.errorMessage !== "") {
            divError = <div className="ui warning message"> {this.state.errorMessage} </div>
        } else {
            divError = <div></div>
        }

        return (
            <div>
                <div className="row">
                    <Header className="header" as="h1" color="yellow">
                        TODO LIST
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                        type="text"
                        name="task"
                        onChange={this.onChange}
                        value={this.state.task}
                        fluid
                        placeholder="Ajouter une tache">
                        </Input>
                        {/*<Button>Créer une tache</Button>*/}
                    </Form>
                </div>

                {btnDeleteAll}
                <div className="row">
                    <Card.Group>{this.state.items}</Card.Group>
                </div>
                {divError}
            </div>
        );
    }
}

export default TodoList;
