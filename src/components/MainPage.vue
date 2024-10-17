<template>
  <q-header elevated class="bg-dark text-white">
    <q-toolbar>
      <q-img :src="require('@/assets/Vonix.png')" alt="Logo" class="logo" />

      <q-btn-dropdown
        flat
        icon="chat"
        label="Configurar Bot"
        class="text-white btn-menu"
      >
        <q-list>
          <q-item clickable @click="goToDialog">
            <q-item-section>
              <q-item-label>Diálogos</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list>
          <q-item clickable @click="goToQuestion">
            <q-item-section>
              <q-item-label>Perguntas</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list>
          <q-item clickable @click="goToResponse">
            <q-item-section>
              <q-item-label>Respostas</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn label="WhatsApp" icon="fab fa-whatsapp" flat class="text-white btn-menu" @click="goToQrCode" />
      <q-space />
      
      <q-btn-dropdown
        flat
        icon="menu"
        class="text-white"
      >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Configurações</div>

            <q-toggle v-model="isDarkMode" label="Modo Dark" @update:model-value="toggleDarkMode" />
            <q-separator inset class="q-mx-lg" />
            <q-btn
              flat
              icon="manage_accounts"
              label="Editar Perfil"
              class="q-mt-md"
              @click="editProfile" 
            />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">Alexandre Dias</div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script>
import { useQuasar } from 'quasar';

export default {
  name: 'MainPage',
  setup() {
    const $q = useQuasar();
    const isDarkMode = $q.dark.isActive;

    const toggleDarkMode = (value) => {
      $q.dark.set(value);
    };

    return {
      isDarkMode,
      toggleDarkMode,
    };
  },
  methods: {
    goToDialog() {
      this.$router.push('/flow');
    },
    goToQuestion() {
      this.$router.push('/question');
    }, 
    goToResponse() {
      this.$router.push('/response');
    },
    goToQrCode() {
      this.$router.push('/qrcode');
    },
    editProfile() {
      this.$router.push('/editar-perfil');
    },
  },
};
</script>

<style scoped>
.logo {
  max-width: 50px;
  margin-right: 10px;
}

.btn-menu {
  padding-left: 10px;
}

.q-btn-dropdown .q-btn__content {
  display: flex;
  align-items: center;
}
</style>