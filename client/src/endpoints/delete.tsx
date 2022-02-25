/* eslint-disable no-console */
import axios from 'axios';
import { contentType, endpoint } from '.';

export async function deleteTaskEndpoint(id: number) {
  const res = await axios.delete(`${endpoint}/api/deleteTask/${id}`, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res;
}

export async function deleteAllTasksEndpoint() {
  const res = await axios.delete(`${endpoint}/api/deleteAllTasks`, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res;
}
