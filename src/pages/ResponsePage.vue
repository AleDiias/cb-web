<template>
    <q-page>
      <q-container>
        <br />
        <div class="button-container">
          <div class="col-auto table-title q-pr-sm"> Respostas </div>
          <q-btn label="Cadastrar" color="transparent" text-color="black" icon="add" @click="showDialog = true" />
        </div>
  
        <q-table
          :rows="responses"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-edit="{ row }">
            <q-td>
              <q-btn flat icon="edit" class="edit-btn" @click="editResponse(row)" />
            </q-td>
          </template>
        </q-table>
  
        <q-dialog v-model="showDialog">
          <q-card style="min-width: 500px;">
            <q-card-section>
              <div class="text-h6">{{ editMode ? 'Editar' : 'Adicionar' }} Resposta</div>
            </q-card-section>
  
            <q-card-section>
              <q-form @submit.prevent="saveResponse">
                <q-input v-model="newResponse.title" label="Título da Resposta" outlined class="q-mb-sm" />
  
                <q-select
                  v-model="responseType"
                  :options="responseTypes"
                  label="Tipo de Resposta"
                  outlined
                  class="q-mb-sm"
                />
  
                <div v-for="(bubble, index) in newResponse.bubbles" :key="index" class="q-mb-sm row q-gutter-sm items-center">
                  <q-input
                    v-model="bubble.text"
                    placeholder="Digite sua mensagem"
                    outlined
                    class="col"
                    style="max-width: 85%;"  
                    rows="2"
                    :autogrow="false"
                    :maxlength="255"
                    @input="updateCharacterCount(index)"
                  />
  
                  <q-btn
                    flat icon="delete" color="negative"
                    @click="removeBubble(index)"
                    class="col-auto"
                    v-if="newResponse.bubbles.length > 1"
                  />
  
                  <q-btn
                    flat icon="move_up" color="primary"
                    @click="moveBubble(index, 'up')"
                    class="col-auto"
                    v-if="index > 0"
                  />
                  <q-btn
                    flat icon="move_down" color="primary"
                    @click="moveBubble(index, 'down')"
                    class="col-auto"
                    v-if="index < newResponse.bubbles.length - 1"
                  />
                  
                  <span :style="{ color: bubble.text.length === 255 ? 'red' : 'black' }" class="character-counter">
                    {{ bubble.text.length }} / 255
                  </span>
                </div>
  
                <q-btn label="Adicionar Balão" icon="add" color="primary" flat @click="addBubble" />
              </q-form>
            </q-card-section>
  
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" @click="resetDialog" />
              <q-btn flat label="Salvar" color="primary" @click="saveResponse" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-container>
    </q-page>
  </template>
  
  <script>
  export default {
    name: 'ResponsePage',
    data() {
      return {
        showDialog: false,
        editMode: false,
        responseType: 'Em sequencia',
        responseTypes: [
          { label: 'Em sequência', value: 'sequencia' },
          { label: 'Como alternativas', value: 'alternativa' }
        ],
        responses: [],
        newResponse: {
          title: '',
          bubbles: [{ text: '' }]
        },
        columns: [
      { name: 'title', label: 'Título', align: 'left', field: 'title', style: 'width: 60%'  },
      { name: 'responseType', label: 'Tipo de Resposta', align: 'left', field: 'responseType', style: 'width: 5%'  },
      { name: 'bubbles', label: 'Bubbles', align: 'left', field: 'bubbles', style: 'width: 35%'  },
          { name: 'edit', label: 'Editar', align: 'center', style: 'width: 1%' }
        ]
      };
    },
    methods: {
    loadData() {
      fetch('http://localhost:3001/utters')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            this.responses = data;
          } else {
            console.error('Dados recebidos não são um array:', data);
            this.responses = [];
          }
        })
        .catch(error => {
          console.error('Erro ao carregar os dados:', error);
          this.responses = [];
        });
    },
      addBubble() {
        this.newResponse.bubbles.push({ text: '' });
      },
      removeBubble(index) {
        this.newResponse.bubbles.splice(index, 1);
      },
      moveBubble(index, direction) {
        if (direction === 'up' && index > 0) {
          const temp = this.newResponse.bubbles[index];
          this.newResponse.bubbles[index] = this.newResponse.bubbles[index - 1];
          this.newResponse.bubbles[index - 1] = temp;
        } else if (direction === 'down' && index < this.newResponse.bubbles.length - 1) {
          const temp = this.newResponse.bubbles[index];
          this.newResponse.bubbles[index] = this.newResponse.bubbles[index + 1];
          this.newResponse.bubbles[index + 1] = temp;
        }
      },
      saveResponse() {
    if (this.newResponse.title.trim() !== '' && this.newResponse.bubbles.every(bubble => bubble.text.trim() !== '')) {
        const newEntry = {
        id: this.editMode ? this.newResponse.id : Date.now(),
        title: this.newResponse.title,
        responseType: this.responseType,
        bubbles: this.newResponse.bubbles.map(bubble => bubble.text)
    };

    const apiUrl = this.editMode ? `http://localhost:3001/utters/${newEntry.id}` : 'http://localhost:3001/utters/create';
    const method = this.editMode ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao salvar no banco');
      }
      return response.json();
    })
    .then(data => {
  if (data.success) {
    if (this.editMode) {
      this.responses = this.responses.map(r => (r.id === newEntry.id ? newEntry : r));
    } else {
      this.responses.push(newEntry);
    }
    this.$q.notify({
      message: 'Salvo com sucesso!',
      type: 'positive',
      position: 'top'
    });
    this.resetDialog(); // Fecha o dialog e reseta os campos
  } else {
    console.error('Erro ao salvar resposta', data);
  }
})
    .catch(error => console.error('Erro ao enviar dados', error));
  } else {
    console.error('Título ou balões estão vazios.');
  }
},
            editResponse(row) {
            this.editMode = true;
            this.responseType = row.responseType;
            this.newResponse = {
                id: row.id,
                title: row.title,
                bubbles: Array.isArray(row.bubbles)
                ? row.bubbles.map(bubble => (typeof bubble === 'string' ? { text: bubble } : bubble))
                : [{ text: '' }]
            };
            this.showDialog = true;
            },
      resetDialog() {
        this.showDialog = false;
        this.editMode = false;
        this.responseType = 'Em sequencia';
        this.newResponse = {
          title: '',
          bubbles: [{ text: '' }]
        };
      }
    },
    mounted() {
    this.loadData(); // Carrega as respostas ao carregar a página
  }
  };
  </script>
  
  <style scoped>
  .table-title {
    font-family: "Montserrat";
    font-weight: 600;
    font-size: 18px;
    color: #263238;
    padding-left: 5px;
  }
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
  }
  
  .q-btn {
    margin-left: auto;
  }
  
  .edit-btn {
    margin-left: auto;
  }
  
  .q-separator {
    margin: 16px 0;
  }
  
  .character-counter {
    font-size: 12px;
    position: relative;
    right: 410px;
    bottom: 20px;
  }
  </style>
