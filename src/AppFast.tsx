import { useSignal, useSignals } from "./signalsReact";

function ExpensiveComponent() {
  console.log("rendering ExpensiveComponent");
  // Block 1s
  const start = Date.now();
  while (Date.now() - start < 1000) {}
  return <p>ExpensiveComponent</p>;
}

function App() {
  const [getCount, setCount] = useSignal(0);
  return (
    <>
      <h1>React app ⚛️</h1>
      <ValueDisplay getValue={getCount} />
      <ValueIncrementButton onClick={() => setCount(getCount() + 1)} />

      <ExpensiveComponent />
    </>
  );
}

function ValueDisplay({ getValue }) {
  useSignals();
  return <p>Value: {getValue()}</p>;
}

function ValueIncrementButton({ onClick }) {
  return <button onClick={onClick}>Increment</button>;
}

export default App;
