import LoadingComponent from './component/Loading.vue'
import ErrorComponent from './component/Error.vue'
import { defineAsyncComponent } from 'vue'

export const asyncModal = (filePath) =>
  defineAsyncComponent(() => import(`@/views/${filePath}.vue`))

export const asyncModalWithOptions = (filePath) =>
  defineAsyncComponent({
    loader: () => import(`@/views/${filePath}.vue`),
    delay: 200,
    timeout: 3000,
    errorComponent: ErrorComponent,
    loadingComponent: LoadingComponent
  })
