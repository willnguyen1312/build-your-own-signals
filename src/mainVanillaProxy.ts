import { computed, effect, signal } from "./signalsProxy";

const countSignal = signal(0);
const doubleCount = computed(() => countSignal.value * 2);

export const createApp = () => {
  const app = document.createElement("div");
  app.innerHTML = `
  <div id="vanilla">
    <h1>Vanilla app 🍦</h1>
    <p id="value">Value: ${countSignal.value}</p>
    <p id="doubleValue">Double Value: ${doubleCount.value}</p>
    <button id="increment">Increment</button>
  </div>
`;
  document.body.appendChild(app);

  effect(() => {
    document.querySelector("#value")!.textContent = `Value: ${countSignal.value}`;
    document.querySelector("#doubleValue")!.textContent = `Double Value: ${doubleCount.value}`;
  });

  document.querySelector("button#increment")!.addEventListener("click", () => {
    countSignal.value++;
  });

  return app;
};

createApp();
