/* eslint-disable no-console */
import axios from 'axios';
import { contentType, endpoint } from '.';

export default async function createTaskEndpoint(task: string) {
  const res = await axios.post(
    `${endpoint}/api/task`,
    { task },
    {
      headers: {
        'Content-Type': contentType,
      },
    },
  );
  return res;
}
