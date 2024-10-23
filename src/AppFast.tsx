import { useSignal } from "@preact/signals-react/runtime";

function ExpensiveComponent() {
  console.log("rendering ExpensiveComponent");
  // Block 2s
  const start = Date.now();
  while (Date.now() - start < 2000) {}
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
  return <p>Value: {value.value}</p>;
}

function ValueIncrementButton({ onClick }) {
  return <button onClick={onClick}>Increment</button>;
}

export default App;
