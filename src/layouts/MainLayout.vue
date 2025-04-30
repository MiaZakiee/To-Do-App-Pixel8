<script setup>
import { ref } from 'vue'
import NewActivity from '../components/NewActivity.vue'
// weird vue import syntax. i have to disable the warning :D
// eslint-disable-next-line
import ActivityList from '../components/ActivityList.vue'

// Create a reference to the ActivityList component
const activityList = ref(null)

// Define the handleTaskAdded function
function handleTaskAdded(task) {
  // Instead of fetching all tasks again, just add the new one directly
  activityList.value?.addNewTask(task)
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="dark-theme">
    <q-page-container class="q-pa-md">
      <div class="todo-container">
        <new-activity @task-added="handleTaskAdded" />
        <activity-list ref="activityList" />
      </div>
    </q-page-container>
  </q-layout>
</template>


<style scoped>
.dark-theme {
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
  overflow: hidden;
}

.todo-container {
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}
</style>
