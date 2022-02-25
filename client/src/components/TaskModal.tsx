/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface taskType {
    _id: number,
    task: string,
    status: boolean
}

interface FormValues {
    propTask : taskType,
    onUpdate: (data: taskType) => void;
}

function ModalExampleModal({ propTask = { _id: 0, task: 'default', status: true }, onUpdate }: FormValues) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<taskType>();
  const onSubmit: SubmitHandler<taskType> = (data) => {
    const taskToUpdate = propTask;
    taskToUpdate.task = data.task;
    onUpdate(taskToUpdate);
    setOpen(false);
  };

  // Cette fonction ne marche pas :(
  function handleKeyDown(e: KeyboardEvent): void {
    const code = e.key;
    if (code === 'enter') {
      e.preventDefault();
      handleSubmit(onSubmit);
    }
  }

  return (
    <Modal
      as={Form}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e: KeyboardEvent) => handleKeyDown}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Edit</Button>}
      size="tiny"
    >
      <Modal.Header>
        Change task :
        {' '}
        {propTask.task}
        {' '}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <label htmlFor="updatedTask">New task name : </label>
          <input id="updatedTask" {...register('task')} />

        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Save"
          labelPosition="right"
          icon="checkmark"
          type="submit"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ModalExampleModal;
