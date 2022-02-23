import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { SubmitHandler, useForm } from "react-hook-form";

interface taskType {
    _id: number, 
    task: string
}

interface FormValues {
    propTask : taskType,
    onUpdate: (p: taskType) => void;
}


function ModalExampleModal( {propTask = {_id : 11, task : "test"}, onUpdate}: FormValues ) {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit } = useForm<taskType>();    
    const onSubmit: SubmitHandler<taskType> = data => {
        propTask.task = data.task
        onUpdate(propTask)
        setOpen(false);
    } 
    
    return (
      <Modal 
        as={Form}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Edit</Button>}
        size="tiny"
      >
        <Modal.Header>Change task : {propTask.task} </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <label>New task name : </label>
            <input {...register("task")}/>

          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            content="Save"
            labelPosition='right'
            icon='checkmark'
            type='submit'
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
  
  export default ModalExampleModal