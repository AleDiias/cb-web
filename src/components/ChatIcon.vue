<template>
    <q-btn
      icon="chat"
      fab
      color="primary"
      class="chat-icon"
      @click="toggleChat"
    />
  </template>
  
  <script>
  export default {
    name: 'ChatIcon',
    methods: {
      toggleChat() {
        this.$emit('toggle-chat');
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  </style>