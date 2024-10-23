import { useState } from "react";

function ExpensiveComponent() {
  console.log("rendering ExpensiveComponent");
  // Block 2s
  const start = Date.now();
  while (Date.now() - start < 2000) {}
  return <p>ExpensiveComponent</p>;
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>React app ⚛️</h1>
      <ValueDisplay value={count} />
      <ValueIncrementButton onClick={() => setCount(count + 1)} />

      <ExpensiveComponent />
    </>
  );
}

function ValueDisplay({ value }) {
  return <p>Value: {value}</p>;
}

function ValueIncrementButton({ onClick }) {
  return <button onClick={onClick}>Increment</button>;
}

export default App;
