<template>
  <div class="flex h-full w-full grid grid-cols-3 gap-4">
    <div>
      <t-card
        class="h-auto"
        :header="!edit ? 'Add Todo' : 'Edit Todo'"
        :classes="{
          wrapper: 'border rounded shadow-sm bg-white border-gray-100',
          body: 'p-3',
          header: 'border-b border-gray-100 p-3 rounded-t text-xl font-bold',
          footer: 'border-gray-100 border-t p-3 rounded-b',
        }"
      >
        <form @submit.prevent="handleSubmitTodo">
          <t-input
            v-model="form['title']"
            name="my-input"
            placeholder="Title"
            class="my-2"
          />
          <label v-if="errors['title']" class="text-red-400">{{
            errors.title[0]
          }}</label>
          <t-textarea
            rows="15"
            max-rows="25"
            v-model="form['description']"
            name="my-textarea"
            placeholder="Description"
            class="my-2"
          />
          <label v-if="errors['description']" class="text-red-400">{{
            errors.description[0]
          }}</label>
          <t-button type="submit" class="mt-4">Save</t-button>
        </form>
      </t-card>
    </div>
    <div class="col-span-2 flex grid grid-cols-3 gap-2 overflow-y-scroll">
      <t-card
        class="h-72"
        v-for="todo in todos"
        :key="todo.id"
        :classes="{
          wrapper: 'border rounded shadow-sm bg-white border-gray-100',
        }"
      >
        <div class="p-3 border-b">
          <label>{{ todo.title }}</label>
        </div>
        <div class="p-3 overflow-y-auto h-44">
          <p>{{ todo.description }}</p>
        </div>

        <template v-slot:footer>
          <div class="flex mx-3">
            <t-button
              type="button"
              :disabled="selectedTodo && selectedTodo.id === todo.id"
              class="mr-2"
              @click="handleDeleteTodo(todo)"
              >Delete</t-button
            >
            <t-button type="button" class="ml-2" @click="handleEditTodo(todo)"
              >Edit</t-button
            >
          </div>
        </template>
      </t-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Edit2Icon, Trash2Icon } from "vue-feather-icons";
import _ from "lodash";

export default {
  components: {
    Edit2Icon,
    Trash2Icon,
  },
  data() {
    return {
      todos: [],
      selectedTodo: {},
      form: {},
      edit: false,
      errors: {},
    };
  },
  created() {
    this.getTodos();
  },
  methods: {
    getTodos() {
      axios.get("/api/todos").then((response) => {
        this.todos = response.data;
      });
    },
    handleSubmitTodo() {
      if (this.edit) {
        this.$dialog
          .confirm("Update todo?", "This action cannot be undone.", "info")
          .then((result) => {
            if (result.isOk) {
              axios
                .put(`/api/todos/${this.selectedTodo.id}`, this.form)
                .then(() => {
                  this.getTodos();
                  this.edit = false;
                  this.form = {};
                  this.selectedTodo = {};
                  this.errors = {};
                })
                .catch((error) => {
                  if (error.response.status === 422) {
                    this.errors = error.response.data.errors;
                  }
                });
              return;
            }
            return;
          });
        return;
      }

      this.$dialog
        .confirm("Add todo?", "This action cannot be undone.", "info")
        .then((result) => {
          if (result.isOk) {
            axios
              .post("/api/todos", this.form)
              .then((response) => {
                this.getTodos();
                this.errors = {};
                this.form = {};
              })
              .catch((error) => {
                if (error.response.status === 422) {
                  this.errors = error.response.data.errors;
                }
              });
            return;
          }
          return;
        });
    },
    handleEditTodo(todo) {
      this.form = _.cloneDeep(todo);
      this.selectedTodo = todo;
      this.edit = true;
      this.errors = {};
    },
    handleDeleteTodo(todo) {
      if (todo.id === this.selectedTodo.id) {
        return;
      }

      this.$dialog
        .confirm("Delete todo?", "This action cannot be undone.", "info")
        .then((result) => {
          if (result.isOk) {
            axios.delete(`/api/todos/${todo.id}`).then(() => this.getTodos());
            return;
          }
          return;
        });
    },
  },
};
</script>

<style>
</style>