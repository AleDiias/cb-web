<template>
  <div v-if="internalIsOpen" class="chat-window">
    <div class="header">
      <div class="text-h6 chatbot-title">Vonix - ChatBot</div>
      <q-btn icon="close" flat @click="closeChat" class="close-button" />
    </div>
    <q-separator />
    <div ref="chatMessages" class="chat-messages">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        :class="{'sent-message': message.isSent, 'received-message': !message.isSent}"
      >
        <div class="message-bubble">
          <span class="message-text">{{ message.text }}</span>
          <img v-if="message.image" :src="message.image" alt="Imagem do bot" class="message-image" />
          <div class="message-time">{{ message.time }}</div>
          <div v-if="message.buttons" class="buttons">
          <q-btn
            v-for="(button, idx) in message.buttons"
            :key="idx"
            @click="sendMessage(button.payload)"
            :label="button.title"
            flat
          />
        </div>
        </div>
      </div>
    </div>
    <q-separator />
    <div class="input-area">
      <q-input
        v-model="newMessage"
        placeholder="Digite sua mensagem..."
        class="message-input"
        @keyup.enter="sendMessage"
      />
      <q-btn icon="send" @click="sendMessage" flat class="send-button" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      internalIsOpen: this.isOpen,
      messages: [],
      newMessage: '',
      ws: null,
    };
  },
  watch: {
    isOpen(newValue) {
      this.internalIsOpen = newValue;
    },
    internalIsOpen(newValue) {
      this.$emit('update:isOpen', newValue);
    },
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://localhost:8080/ws');

      this.ws.onopen = () => {
        console.log('Conectado ao WebSocket');
      };

      this.ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (Array.isArray(response)) {
          response.forEach((msg) => {
            // Verifica se a mensagem é uma imagem
            if (msg.image) {
              this.messages.push({
                text: '', // Se for uma imagem, não precisamos de texto
                image: msg.image, // Armazena a URL da imagem
                isSent: false,
                time: currentTime,
              });
            } else {
              this.messages.push({
                text: msg.text || 'Erro: mensagem vazia',
                buttons: msg.buttons || [],
                isSent: false,
                time: currentTime,
              });
            }
          });
        } else {
          // Se não for um array, trata a mensagem única
          if (response.image) {
            this.messages.push({
              text: '', // Se for uma imagem, não precisamos de texto
              image: response.image, // Armazena a URL da imagem
              isSent: false,
              time: currentTime,
            });
          } else {
            this.messages.push({
              text: response.text || 'Erro: mensagem vazia',
              buttons: response.buttons || [],
              isSent: false,
              time: currentTime,
            });
          }
        }

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      };

      this.ws.onclose = () => {
        console.log('Conexão fechada');
      };

      this.ws.onerror = (error) => {
        console.error('Erro na conexão WebSocket', error);
      };
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.messages.push({
          text: this.newMessage,
          isSent: true,
          time: currentTime,
        });

        this.ws.send(JSON.stringify({ message: this.newMessage }));
        this.newMessage = '';
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    closeChat() {
      this.internalIsOpen = false;
    },
    toggleChat() {
      this.internalIsOpen = !this.internalIsOpen;
    },
    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },
  },
  mounted() {
    this.scrollToBottom();
    this.connectWebSocket();
  },
};
</script>

<style scoped>
body[data-theme='dark'] .chat-input {
  background-color: #333; 
  color: white; 
}

.chat-window {
  position: fixed;
  bottom: 85px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgb(23, 108, 227);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.chatbot-title {
  color: white;
}

.close-button {
  color: rgb(0, 0, 0);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 110px 10px 10px;
  color: rgb(0, 0, 0);
}

.sent-message {
  display: flex;
  justify-content: flex-end;
  margin: 5px 0; 
}

.received-message {
  display: flex;
  justify-content: flex-start;
  margin: 5px 0;
}

.message-bubble {
  background-color: #e1ffc7;
  border-radius: 10px;
  padding: 10px;
  max-width: 40%;
  position: relative;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.received-message .message-bubble {
  background-color: #f0f0f0; 
}

.message-bubble::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 10%; 
  margin-left: -5px; 
  border-width: 5px; 
  border-style: solid;
  border-color: transparent transparent #e1ffc7 transparent; 
}

.received-message .message-bubble::after {
  border-color: transparent transparent #f0f0f0 transparent;
}

.message-time {
  font-size: 10px;
  color: gray;
  margin-top: 2px;
  text-align: right;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc; 
}

.message-input {
  flex: 1; 
  margin-right: 10px; 
}

.send-button {
  color: #ccc;
}

.send-button:hover {
  color: #000000;
}

.message-image {
  max-width: 100%; 
  border-radius: 5px;
  margin-top: 5px;
}
</style>