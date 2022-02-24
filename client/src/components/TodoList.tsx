/* eslint-disable no-console */
import React, {
  ChangeEvent, Component, CSSProperties, ReactNode,
} from 'react';
import axios from 'axios';
import {
  Header, Form, Icon, Input, Card,
  SemanticCOLORS,
} from 'semantic-ui-react';
import TaskModal from './TaskModal';
import { TaskType, endpoint } from '../endpoints';

interface StateType {
    task: string;
    items: Array<string>;
    errorMessage: string;
}

class TodoList extends Component<{}, StateType> {
  constructor(props: never) {
    super(props);

    this.state = {
      task: '',
      items: [],
      errorMessage: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.getTask();
  }

  handleUpdate(newTask: TaskType) {
    this.updateTask(newTask);
  }

  getTask = () => {
    axios.get(`${endpoint}/api/task`).then((res) => {
      if (res.data) {
        this.setState({
          items: res.data.map((item: TaskType) => {
            const isDone = item.status;
            let iconUndoRedo;
            if (!isDone) { // status : false
              iconUndoRedo = (
                <div>
                  <Icon
                    onClick={() => this.undoTask(item._id)}
                    name="check circle"
                    color="green"
                  />
                  <span
                    onClick={() => this.undoTask(item._id)}
                    onKeyPress={() => this.undoTask(item._id)}
                    style={{ paddingRight: 10 }}
                    role="button"
                    tabIndex={0}
                  >
                    Done
                  </span>
                </div>
              );
            } else { // status : true
              iconUndoRedo = (
                <div>
                  <Icon
                    onClick={() => this.redoTask(item._id)}
                    name="check circle outline"
                    color="red"
                  />
                  <span
                    onClick={() => this.redoTask(item._id)}
                    onKeyPress={() => this.redoTask(item._id)}
                    style={{ paddingRight: 10 }}
                    role="button"
                    tabIndex={0}
                  >
                    Undone
                  </span>
                </div>
              );
            }

            let coloring : SemanticCOLORS = 'yellow';
            let style: CSSProperties = {
              wordWrap: 'break-word',
            };
            if (item.status) {
              coloring = 'green';
              style = {
                ...style, textDecorationLine: 'line-through',
              };
            } else {
              coloring = 'red';
              style = {
                ...style, textDecorationLine: 'none',
              };
            }
            return (
              <Card key={item._id} color={coloring} fluid className="rough">
                {/* TODO : passer le card.header en input quand dblClick */}
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={style}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">

                    <TaskModal propTask={item} onUpdate={this.handleUpdate} />

                    {/* changement du bouton en fonction de l'etat */}
                    {iconUndoRedo}
                    <Icon
                      onClick={() => this.deleteTask(item._id)}
                      name="delete"
                      color="red"
                    />
                    <span
                      onClick={() => this.deleteTask(item._id)}
                      onKeyPress={() => this.deleteTask(item._id)}
                      style={{ paddingRight: 10 }}
                      role="button"
                      tabIndex={0}
                    >
                      Delete
                    </span>

                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          }),
        });
      } else {
        this.setState({
          items: [],
        });
      }
    });
  };

  onSubmit = () => { // creation d'une tache
    const { task } = this.state;

    if (task) {
      axios.post(
        `${endpoint}/api/task`,
        { task },
        {
          headers: {
            'Content-Type': 'application/x-wwww-form-urlencoded',
          },
        },
      ).then((res) => {
        this.getTask();
        this.setState({
          task: '',
        });
        console.log(res);
      });
    }
  };

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      task: event.target.value,
    });
  };

  undoTask = (id: number) => {
    axios.put(`${endpoint}/api/undoTask/${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      console.log(res);
      this.getTask();
    });
  };

  redoTask = (id: number) => {
    axios.put(`${endpoint}/api/redoTask/${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      console.log(res);
      this.getTask();
    });
  };

  updateTask(paramTask: TaskType) {
    console.log(`item dans update : ${JSON.stringify(paramTask.task)}`);
    const newTask = {
      ID: paramTask._id,
      task: paramTask.task,
      status: paramTask.status,
    };

    axios.put(`${endpoint}/api/task/${newTask.ID}`, newTask, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      console.log(res);
      this.getTask();
    }).catch((error) => {
      console.error('There was an error!', error);
    });
  }

  deleteTask(id: number) {
    axios.delete(`${endpoint}/api/deleteTask/${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      console.log(res);
      this.getTask();
    });
  }

  deleteAllTasks() {
    axios.delete(`${endpoint}/api/deleteAllTasks`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      console.log(res);
      this.getTask();
    });
  }

  render(): ReactNode {
    const { items } = this.state;
    let btnDeleteAll; // affichage du btn ssi au moins 1 item
    if (items.length > 0) {
      btnDeleteAll = (
        <span
          onClick={() => this.deleteAllTasks()}
          onKeyPress={() => this.deleteAllTasks()}
          role="button"
          tabIndex={0}
        >
          <Icon
            name="times"
            color="black"
          />
          Delete all tasks
        </span>
      );
    } else {
      btnDeleteAll = <span />;
    }

    const { errorMessage } = this.state;
    let divError; // affichage de la div erreur ssi erreur existe
    if (errorMessage !== '') {
      divError = (
        <div className="ui warning message">
          {' '}
          {errorMessage}
          {' '}
        </div>
      );
    } else {
      divError = <div />;
    }

    const { task } = this.state;
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
              value={task}
              fluid
              placeholder="Ajouter une tache"
            />
            {/* <Button>Créer une tache</Button> */}
          </Form>
        </div>

        {btnDeleteAll}
        <div className="row">
          <Card.Group>{items}</Card.Group>
        </div>
        {divError}
      </div>
    );
  }
}

export default TodoList;
