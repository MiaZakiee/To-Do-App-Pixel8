import { api } from "boot/axios";

const TASK_ENDPOINT = "https://jsonplaceholder.typicode.com/todos/";

export default {
  getTasks() {
    return api.get(TASK_ENDPOINT);
  },
  addTask(task) {
    return api.post(TASK_ENDPOINT, {
      ...task,
      userId: 1, // Hardcoded
    });
  },
  updateTask(taskId, task) {
    return api.put(`${TASK_ENDPOINT}/${taskId}`, task);
  },
  deleteTask(taskId) {
    return api.delete(`${TASK_ENDPOINT}/${taskId}`);
  },
};
