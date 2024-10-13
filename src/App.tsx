import { useEffect, useReducer } from "react";
import { signal, computed, effect } from "./signals";

const [count, setCount] = signal(0);

const doubleCount = computed(() => count() * 2);

function App() {
  const rerender = useReducer((x) => x + 1, 0)[1];

  useEffect(() => {
    return effect(() => {
      count();
      rerender();
    });
  }, []);

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
