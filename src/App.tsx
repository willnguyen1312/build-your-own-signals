// import { signal, computed } from "./signals";
// import { useSignals } from "./signalsReact";

import { signal, computed } from "@preact/signals-core";
import { useSignals } from "@preact/signals-react/runtime";

const countSignal = signal(0);
const doubleCount = computed(() => countSignal.value * 2);

function App() {
  useSignals();

  return (
    <>
      <p>Value: {countSignal.value}</p>
      <p>Double Value: {doubleCount.value}</p>
      <button onClick={() => countSignal.value++}>Increment</button>
    </>
  );
}

export default App;
