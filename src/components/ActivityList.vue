<template>
  <div class="activity-list q-px-xl q-pb-xl">
    <!-- Loading state -->
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Loading tasks...</div>
    </div>

    <!-- Tasks list -->
    <div v-else>
      <div v-for="task in tasks" :key="task.id" class="task-card q-mb-md">
        <div class="task-item">
          <div class="row items-center no-wrap">
            <div class="col-auto">
              <q-checkbox 
                v-model="task.completed" 
                @update:model-value="() => toggleTaskStatus(task)"
                :disable="updatingTaskId === task.id" 
                color="primary"
                dark
                size="lg"
                class="task-checkbox"
              />
            </div>
            <div class="col text-body1 task-text" :class="{ 'text-strike': task.completed }">
              {{ task.text }}
            </div>
            <div class="col-auto">
              <q-btn
                flat
                round
                icon="delete"
                color="grey-6"
                size="md"
                @click="deleteTask(task)"
                :loading="deletingTaskId === task.id"
                class="delete-btn"
              >
                <q-tooltip>Delete Task</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tasks.length === 0" class="text-center q-pa-lg text-grey-6">
        <q-icon name="check_circle" size="3rem" />
        <div class="q-mt-md text-h6">All done!</div>
        <div class="q-mt-sm">Add a new task above to get started.</div>
      </div>
    </div>

    <!-- Error handling -->
    <q-dialog v-model="errorDialog" persistent dark>
      <q-card class="bg-dark text-white">
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="negative" text-color="white" />
          <span class="q-ml-sm">An error occurred</span>
        </q-card-section>
        <q-card-section>
          {{ errorMessage }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Dismiss" color="primary" v-close-popup />
          <q-btn flat label="Retry" color="primary" @click="fetchTasks" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import taskServices from '../services/taskServices'

const tasks = ref([])
const loading = ref(false)
const errorDialog = ref(false)
const errorMessage = ref('')
const updatingTaskId = ref(null)
const deletingTaskId = ref(null)

async function fetchTasks() {
  loading.value = true
  try {
    const response = await taskServices.getTasks()
    // Map API data to our format
    tasks.value = response.data.map(task => ({
      id: task.id,
      text: task.title,
      completed: task.completed
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    errorMessage.value = error.response?.data?.message || 'Failed to load tasks'
    errorDialog.value = true
  } finally {
    loading.value = false
  }
}

// Method to add a new task to the list directly
function addNewTask(task) {
  // Add the new task to the beginning of the array to show it first
  tasks.value.unshift(task)
}

async function toggleTaskStatus(task) {
  updatingTaskId.value = task.id
  try {
    const updatedTask = { 
      id: task.id,
      title: task.text,
      completed: task.completed,
      userId: 1
    }
    
    // For JSONPlaceholder, we should assume all operations succeed
    // but handle possible failures gracefully
    await taskServices.updateTask(task.id, updatedTask)
    
    // With a real backend, the response would confirm the update
    console.log('Task updated successfully')
  } catch (error) {
    console.error('Error updating task:', error)
    
    // Only show error dialog for network issues, not 404/500 from JSONPlaceholder
    if (error.code !== 'ERR_BAD_RESPONSE' && error.code !== 'ERR_BAD_REQUEST') {
      errorMessage.value = 'Network error while updating task'
      errorDialog.value = true
    }
    
    // Revert the local change
    task.completed = !task.completed
  } finally {
    updatingTaskId.value = null
  }
}

async function deleteTask(taskToDelete) {
  deletingTaskId.value = taskToDelete.id
  try {
    await taskServices.deleteTask(taskToDelete.id)
    // Remove task from local state after successful API call
    tasks.value = tasks.value.filter(task => task.id !== taskToDelete.id)
  } catch (error) {
    console.error('Error deleting task:', error)
  } finally {
    console.log('Task deleted successfully')
    deletingTaskId.value = null
  }
}

onMounted(() => {
  fetchTasks()
})

// Expose methods to parent component
defineExpose({ fetchTasks, addNewTask })
</script>

<style scoped>
.task-item {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.task-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.task-checkbox {
  margin-right: 8px;
}

.task-text {
  color: #ffffff;
  font-size: 1.1rem;
  word-break: break-word;
  transition: all 0.3s ease;
}

.text-strike {
  text-decoration: line-through;
  color: #9e9e9e;
}

.delete-btn:hover {
  color: #ff5252;
}
</style>