/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { TaskType } from '../endpoints';
import TaskModal from './TaskModal';

interface PropValues {
    item: TaskType,
    coloring: SemanticCOLORS,
    style: React.CSSProperties,
    undoTask: (id: number)=> void,
    redoTask: (id: number)=> void,
    handleUpdate: (paramTask: TaskType) => void,
    deleteTask: (id: number) => void

}

function TodoItem({
  item = { _id: 0, task: 'default', status: true }, coloring, style, undoTask, redoTask, handleUpdate, deleteTask,
}: PropValues) {
  const isDone = item.status;
  let iconUndoRedo;
  if (!isDone) { // status : false
    iconUndoRedo = (
      <div>
        <Icon
          onClick={() => undoTask(item._id)}
          name="check circle"
          color="green"
        />
        <span
          onClick={() => undoTask(item._id)}
          onKeyPress={() => undoTask(item._id)}
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
          onClick={() => redoTask(item._id)}
          name="check circle outline"
          color="red"
        />
        <span
          onClick={() => redoTask(item._id)}
          onKeyPress={() => redoTask(item._id)}
          style={{ paddingRight: 10 }}
          role="button"
          tabIndex={0}
        >
          Undone
        </span>
      </div>
    );
  }
  return (
    <Card key={item._id} color={coloring} fluid className="rough">
      <Card.Content>
        <Card.Header textAlign="left">
          <div style={style}>{item.task}</div>
        </Card.Header>

        <Card.Meta textAlign="right">

          <TaskModal propTask={item} onUpdate={handleUpdate} />

          {/* changement du bouton en fonction de l'etat */}
          {iconUndoRedo}
          <Icon
            onClick={() => deleteTask(item._id)}
            name="delete"
            color="red"
          />
          <span
            onClick={() => deleteTask(item._id)}
            onKeyPress={() => deleteTask(item._id)}
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
}

export default TodoItem;
