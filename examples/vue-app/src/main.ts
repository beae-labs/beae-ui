import { createApp } from "vue"
import BeaeUI from "@beae-ui/vue"
import "./style.css"
import App from "./App.vue"

const app = createApp(App)

app.use(BeaeUI)

app.mount("#app")
