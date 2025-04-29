<script setup>
import NewActivity from '../components/NewActivity.vue'
import ActivityList from '../components/ActivityList.vue'

</script>

<template>
  <q-layout view="lHh Lpr lFf" class="dark-theme">
    <q-page-container class="q-pa-md">
      <new-activity/>
      <activity-list ref="activitylist" />
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
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}
</style>
