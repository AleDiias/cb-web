<template>
  <q-layout view="lHh Lpr lFf">
    <MainPage />
    
    <q-page-container>
      <router-view />
    </q-page-container>

    <ChatIcon @toggle-chat="isChatOpen = !isChatOpen" />
    <ChatWindow :isOpen="isChatOpen" />
  </q-layout>
</template>

<script>
import MainPage from './components/MainPage.vue';
import ChatIcon from './components/ChatIcon.vue';
import ChatWindow from './components/ChatWindow.vue';

export default {
  components: {
    MainPage,
    ChatIcon,
    ChatWindow,
  },
  data() {
    return {
      isChatOpen: false,
    };
  },
};
</script>