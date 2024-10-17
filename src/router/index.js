import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import FlowPage from '../pages/FlowPage.vue'
import QuestionPage from '../pages/QuestionPage.vue'
import ResponsePage from '../pages/ResponsePage.vue'
import QrCode from '../pages/QrCode.vue'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/flow',
    name: 'FlowPage',
    component: FlowPage, 
  },
  {
    path: '/question',
    name: 'QuestionPage',
    component: QuestionPage, 
  },
  {
    path: '/response',
    name: 'ResponsePage',
    component: ResponsePage, 
  },
  {
    path: '/qrcode',
    name: 'QRCode',
    component: QrCode,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;