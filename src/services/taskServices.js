import { api } from "boot/axios";

const TASK_ENDPOINT = "https://jsonplaceholder.typicode.com/todos";

const newTaskIds = new Set();

let nextLocalId = 1000;

export default {
  getTasks() {
    return api.get(TASK_ENDPOINT);
  },
  addTask(task) {
    return api
      .post(TASK_ENDPOINT, {
        ...task,
        userId: 1, // Hardcoded
      })
      .then((response) => {
        const uniqueId = nextLocalId++;

        if (response.data && response.data.id) {
          newTaskIds.add(uniqueId);

          response.data.id = uniqueId;
        }
        return response;
      });
  },
  updateTask(taskId, task) {
    if (newTaskIds.has(taskId)) {
      return Promise.resolve({
        data: task,
        status: 200,
      });
    }
    return api.put(`${TASK_ENDPOINT}/${taskId}`, task);
  },
  deleteTask(taskId) {
    if (newTaskIds.has(taskId)) {
      newTaskIds.delete(taskId);
      return Promise.resolve({
        status: 200,
      });
    }

    return api.delete(`${TASK_ENDPOINT}/${taskId}`);
  },
};
