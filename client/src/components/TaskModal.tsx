import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form, Input, Modal } from 'semantic-ui-react'
import { SubmitHandler, useForm } from "react-hook-form";

interface taskType {
    _id: number, 
    task: string
}

interface FormValues {
    propTask : taskType,
    onUpdate: () => void;
}

let endpoint = "http://localhost:9000";


function ModalExampleModal( {propTask = {_id : 11, task : "test"}, onUpdate}: FormValues ) {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit } = useForm<taskType>();    
    const onSubmit: SubmitHandler<taskType> = data => {
        console.log("new task : " + data.task)
        propTask.task = data.task
        updateTask(propTask)
        onUpdate()
        setOpen(false);
    } 
    console.log("task name : " + propTask.task)


    function updateTask(paramTask: any) {

        console.log("item dans update : " + JSON.stringify(paramTask.task) )
        let newTask = {
            ID: paramTask._id,
            task: paramTask.task,
            status: paramTask.status,
        }

        axios.put(endpoint + "/api/task/" + newTask.ID, newTask, {
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
            },
        } ).then((res)=>{
            console.log(res);
            // informer TodoList du changement pour proc getTask()
        }).catch(error => {
            console.error('There was an error!', error);
        });
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