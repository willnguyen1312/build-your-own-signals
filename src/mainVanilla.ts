import { computed, effect, signal } from "./signals";

const [count, setCount] = signal(0);
const doubleCount = computed(() => count() * 2);

export const createApp = () => {
  const app = document.createElement("div");
  app.innerHTML = `
  <h1>Vanilla app 🍦</h1>
  <p id="value">Value: ${count()}</p>
  <p id="doubleValue">Double Value: ${doubleCount()}</p>
  <button id="increment">Increment</button>
`;
  document.body.appendChild(app);

  effect(() => {
    document.querySelector("#value")!.textContent = `Value: ${count()}`;
    document.querySelector("#doubleValue")!.textContent = `Double Value: ${doubleCount()}`;
  });

  document.querySelector("button#increment")!.addEventListener("click", () => {
    setCount(count() + 1);
  });

  return app;
};

createApp();
