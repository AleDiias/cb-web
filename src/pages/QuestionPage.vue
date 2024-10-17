<template>
    <q-page>
      <q-container>
        <br />
        <div class="button-container">
          <div class="col-auto table-title q-pr-sm"> Pergunta </div>
          <q-btn label="Cadastrar" color="transparent" text-color="black" icon="add" @click="showDialog = true" />
        </div>
  
        <q-table :rows="questions" :columns="columns" row-key="id">
          <template v-slot:body-cell-edit="{ row }">
            <q-td>
              <q-btn flat icon="edit" class="edit-btn" @click="editQuestion(row)" />
            </q-td>
          </template>
          <template v-slot:body-cell-delete="{ row }">
            <q-td>
              <q-btn flat icon="delete" class="delete-btn" color="negative" @click="deleteQuestion(row.id)" />
            </q-td>
          </template>
        </q-table>
  
        <q-dialog v-model="showDialog">
          <q-card style="min-width: 500px;">
            <q-card-section>
              <div class="text-h6">{{ editMode ? 'Editar' : 'Adicionar' }} Questão</div>
            </q-card-section>
  
            <q-card-section>
              <q-form @submit.prevent="saveQuestion">
                <q-input v-model="newQuestion.title"  label="Título da Questão" outlined class="q-mb-sm" />
  
                <div v-for="(question, index) in newQuestion.questions" :key="index" class="q-mb-sm row q-gutter-sm items-center">
                    <q-input
                        v-model="question.text"
                        label="Pergunta"
                        outlined
                        class="col"
                        style="max-width: 85%;"
                        @focus="checkForNewInput(index)"
                    />
                    <q-btn
                        v-if="newQuestion.questions.length > 1"
                        flat icon="delete" color="negative" @click="removeSpecificQuestion(index)"
                        class="col-auto"
                    />
                </div>
  
                <q-btn label="Adicionar Pergunta" icon="add" color="primary" flat @click="addNewQuestion" />
              </q-form>
            </q-card-section>
  
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" @click="resetDialog" />
              <q-btn flat label="Salvar" color="primary" @click="saveQuestion" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-container>
    </q-page>
  </template>
  
  <script>
  export default {
    name: 'QuestionPage',
    data() {
      return {
        showDialog: false,
        editMode: false,
        questions: [],
        newQuestion: {
          title: '',
          questions: [{ text: '' }]
        },
        columns: [
          { name: 'title', label: 'Título da Questão', align: 'left', field: 'title', style: 'width: 65%' },
          { name: 'question', label: 'Perguntas', align: 'left', field: 'question', style: 'width: 25%' },
          { name: 'edit', label: 'Editar', align: 'center', style: 'width: 5%' },
          { name: 'delete', label: 'Excluir', align: 'center', style: 'width: 5%' }
        ]
      };
    },
    methods: {
      addNewQuestion() {
        this.newQuestion.questions.push({ text: '' });
      },
      checkForNewInput(index) {
        if (this.newQuestion.questions[index].text !== '' && index === this.newQuestion.questions.length - 1) {
          this.newQuestion.questions.push({ text: '' });
        }
      },
      saveQuestion() {
        if (this.newQuestion.title.trim() !== '') {
          const combinedQuestions = this.newQuestion.questions
            .filter(q => q.text.trim() !== '')
            .map(q => q.text);
  
          if (combinedQuestions.length > 0) {
            const newEntry = {
              id: Date.now(),
              title: this.newQuestion.title,
              question: combinedQuestions.join(', ')
            };
  
            if (this.editMode) {
              this.questions = this.questions.map(q => (q.id === this.newQuestion.id ? newEntry : q));
            } else {
              this.questions.push(newEntry);
            }
          }
  
          this.resetDialog();
        }
      },
      editQuestion(row) {
        this.editMode = true;
        this.newQuestion = {
          id: row.id,
          title: row.title,
          questions: row.question.split(', ').map(q => ({ text: q }))
        };
        this.showDialog = true;
      },
      deleteQuestion(id) {
        this.questions = this.questions.filter(q => q.id !== id);
      },
      removeSpecificQuestion(index) {
        this.newQuestion.questions.splice(index, 1);
      },
      resetDialog() {
        this.showDialog = false;
        this.editMode = false;
        this.newQuestion = {
          title: '',
          questions: [{ text: '' }]
        };
      }
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
  
  .edit-btn,
  .delete-btn {
    color: black;
  }
  
  .q-btn {
    margin-left: auto;
  }
  
  .q-separator {
    margin: 16px 0;
  }
  </style>