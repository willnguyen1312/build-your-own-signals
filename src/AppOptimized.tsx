import { signal } from "./signalsReactObjectOptimized";

const countSignal = signal(1) as any;

function App() {
  console.log("run once 🚀");
  return (
    <>
      <h1>React app ⚛️</h1>
      <p>Value: {countSignal}</p>
      <button onClick={() => countSignal.value++}>Increment</button>
    </>
  );
}

export default App;
