import { createApp } from "vue";
import App from "./App.vue";
import { startTerminalTitle } from "./shared/title/terminalTitle";
import "./styles/main.css";

createApp(App).mount("#app");
startTerminalTitle();
