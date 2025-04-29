<template>
  <div class="new-activity q-mb-xl q-px-xl q-pt-xl">
    <div class="row q-col-gutter-md">
      <div class="col-9 col-sm-9">
        <q-input 
          v-model="taskText" 
          outlined
          class="task-input"
          placeholder="Enter your task..." 
          dark
          @keyup.enter="addTask" 
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="task_alt" color="grey-5" />
          </template>
        </q-input>
      </div>
      <div class="col-3 col-sm-3">
        <q-btn 
          label="Add task" 
          color="primary" 
          class="full-width task-btn" 
          unelevated
          @click="addTask" 
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import taskServices from '../services/taskServices'

const taskText = ref('')
const loading = ref(false)
const emit = defineEmits(['task-added'])

async function addTask() {
  if (!taskText.value.trim()) return
  
  loading.value = true
  try {
    // Format the task object according to what your API expects
    const newTask = {
      title: taskText.value.trim(),
      completed: false,
      userId: 1
    }
    
    const response = await taskServices.addTask(newTask)
    
    // Map the API response to your app's format
    const addedTask = {
      id: response.data.id,
      text: response.data.title,
      completed: response.data.completed
    }
    
    emit('task-added', addedTask)
    taskText.value = ''
    
    console.log('Task added successfully')
  } catch (error) {
    console.error('Error adding task:', error)
    console.log('Failed to add task')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.task-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.task-input :deep(.q-field__control) {
  border-color: rgba(255, 255, 255, 0.1);
  height: 56px;
}

.task-input :deep(.q-field__native) {
  font-size: 1.1rem;
  color: #fff;
}

.task-btn {
  height: 56px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>