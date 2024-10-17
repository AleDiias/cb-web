<!-- QRCode.vue -->
<template>
  <div class="qr-code-container">
    <template v-if="isConnected">
      <h2>WhatsApp Conectado</h2>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Status</th>
            <th>Desconectar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ connectedNumber }}</td>
            <td>
              <span
                class="status-indicator"
                :class="{ connected: isConnected, disconnected: !isConnected }"
              ></span>
              {{ isConnected ? 'Conectado' : 'Desconectado' }}
            </td>
            <td>
              <i 
                class="fa fa-times disconnect-icon" 
                @click="disconnectNumber"
                title="Desconectar"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <br />
      <h2>Escaneie o QR Code para conectar ao WhatsApp</h2>
      <img :src="qrCode" alt="QR Code" v-if="qrCode" />
      <p v-if="!qrCode">Aguardando QR Code...</p>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrCode: null,
      isConnected: false,
      connectedNumber: null,
      qrCodeInterval: null,
    };
  },
  methods: {
    async fetchQRCode() {
      try {
        const statusResponse = await fetch('http://localhost:3000/status');
        const statusData = await statusResponse.json();

        if (statusData.status === 'conectado') {
          this.isConnected = true;
          this.connectedNumber = statusData.number;
          this.qrCode = null;
          clearInterval(this.qrCodeInterval);
        } else {
          const qrResponse = await fetch('http://localhost:3000/qr');
          const qrData = await qrResponse.json();
          this.qrCode = qrData.qr;
          this.isConnected = false;
          this.connectedNumber = null;
        }
      } catch (error) {
        console.error('Erro ao buscar QR Code ou status:', error);
      }
    },
    async disconnectNumber() {
      try {
        const response = await fetch('http://localhost:3000/disconnect', {
          method: 'POST',
        });

        if (response.ok) {
          this.isConnected = false;
          this.connectedNumber = null;
          this.qrCodeInterval = setInterval(this.fetchQRCode, 10000);
        } else {
          console.error('Erro ao desconectar o número.');
        }
      } catch (error) {
        console.error('Erro ao desconectar número:', error);
      }
    },
  },
  mounted() {
    this.fetchQRCode();
    this.qrCodeInterval = setInterval(this.fetchQRCode, 10000);
  },
  beforeUnmount() {
    clearInterval(this.qrCodeInterval);
  },
};
</script>

<style scoped>
.qr-code-container {
  text-align: center;
  top: 100px;
  margin: 20px;
}

.qr-code-container img {
  width: 200px;
  height: 200px;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-indicator.connected {
  background-color: green;
}

.status-indicator.disconnected {
  background-color: red;
}

.disconnect-icon {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.disconnect-icon:hover {
  transform: scale(1.2);
  color: red;
}

button {
  margin: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>