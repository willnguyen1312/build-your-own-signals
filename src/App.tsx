import { signal, computed, useSignals } from "./signalsReactProxy";

const countSignal = signal(0);
const doubleCount = computed(() => countSignal.value * 2);

function App() {
  useSignals();

  return (
    <>
      <h1>React app ⚛️</h1>
      <p>Value: {countSignal.value}</p>
      <p>Double Value: {doubleCount.value}</p>
      <button onClick={() => countSignal.value++}>Increment</button>
    </>
  );
}

export default App;
