/* eslint-disable no-console */
import axios from 'axios';
import { contentType, endpoint, TaskType } from '.';

export async function undoTaskEndpoint(id: number) {
  const res = await axios.put(`${endpoint}/api/undoTask/${id}`, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res;
}

export async function redoTaskEndpoint(id: number) {
  const res = await axios.put(`${endpoint}/api/redoTask/${id}`, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res;
}

export async function updateTaskEndpoint(paramTask: TaskType) {
  console.log(`item dans update : ${JSON.stringify(paramTask.task)}`);
  const newTask = {
    ID: paramTask._id,
    task: paramTask.task,
    status: paramTask.status,
  };

  const resPut = await axios.put(`${endpoint}/api/task/${newTask.ID}`, newTask, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return resPut;
}
