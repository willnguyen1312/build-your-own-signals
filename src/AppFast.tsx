import { useSignal, useSignals } from "./signalsReactObject";

function ExpensiveComponent() {
  console.log("rendering ExpensiveComponent");
  // Block 1s
  const start = Date.now();
  while (Date.now() - start < 1000) {}
  return <p>ExpensiveComponent</p>;
}

function App() {
  const count = useSignal(0);
  return (
    <>
      <h1>React app ⚛️</h1>
      <ValueDisplay value={count} />
      <ValueIncrementButton onClick={() => count.value++} />

      <ExpensiveComponent />
    </>
  );
}

function ValueDisplay({ value }) {
  useSignals();
  return <p>Value: {value.value}</p>;
}

function ValueIncrementButton({ onClick }) {
  return <button onClick={onClick}>Increment</button>;
}

export default App;
