require('./bootstrap');
require('alpinejs');

import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import {TButton, TCard, TInput, TTextarea, TDialog} from 'vue-tailwind/dist/components'

const components = {
    TButton,
    TCard,
    TInput,
    TTextarea,
    TDialog
}

Vue.use(VueTailwind, components)

Vue.component('example-component', require('./components/ExampleComponent.vue').default)

Vue.prototype.$user = window.App

const app = new Vue({
    el: '#app'
})
