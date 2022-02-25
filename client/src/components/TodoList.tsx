import React, {
  ChangeEvent, Component, CSSProperties, ReactNode,
} from 'react';
import axios from 'axios';
import {
  Header, Form, Icon, Input, Card, SemanticCOLORS,
} from 'semantic-ui-react';
import { TaskType, endpoint } from '../endpoints';
import { redoTaskEndpoint, undoTaskEndpoint, updateTaskEndpoint } from '../endpoints/update';
import { deleteAllTasksEndpoint, deleteTaskEndpoint } from '../endpoints/delete';
import createTaskEndpoint from '../endpoints/create';
import TodoItem from './TodoItems';

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
              <TodoItem
                item={item}
                coloring={coloring}
                style={style}
                undoTask={this.undoTask}
                redoTask={this.redoTask}
                handleUpdate={this.handleUpdate}
                deleteTask={this.deleteTask}
              />
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

  onSubmit = async () => { // creation d'une tache
    const { task } = this.state;
    if (task) {
      const done = await createTaskEndpoint(task);
      this.getTask();
      this.setState({
        task: '',
      });
      return done;
    }
    return task;
  };

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      task: event.target.value,
    });
  };

  undoTask = async (id: number) => {
    const done = await undoTaskEndpoint(id);
    this.getTask();
    return done;
  };

  redoTask = async (id: number) => {
    const done = await redoTaskEndpoint(id);
    this.getTask();
    return done;
  };

  updateTask = async (paramTask: TaskType) => {
    const done = await updateTaskEndpoint(paramTask);
    this.getTask();
    return done;
  };

  deleteTask = async (id: number) => {
    const done = await deleteTaskEndpoint(id);
    this.getTask();
    return done;
  };

  deleteAllTasks = async () => {
    const done = await deleteAllTasksEndpoint();
    this.getTask();
    return done;
  };

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
      divError = <div className="error" />;
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
