import {
  signal,
  computed,
  useSignalEffect,
  useSignals,
  useSignal,
  useComputed,
} from "./signalsReact";

const [count, setCount] = signal(0);
const doubleCount = computed(() => count() * 2);

function App() {
  useSignals();

  // const [count, setCount] = useSignal(0);
  // const doubleCount = useComputed(() => count() * 2);

  useSignalEffect(() => {
    console.log("Count value: ", count());
  });

  return (
    <>
      <h1>React app ⚛️</h1>
      <p>Value: {count()}</p>
      <p>Double Value: {doubleCount()}</p>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </>
  );
}

export default App;
