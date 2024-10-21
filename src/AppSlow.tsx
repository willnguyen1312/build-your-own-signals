import { useState } from "react";

function ExpensiveComponent() {
  console.log("ExpensiveComponent rendered");
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
      <ButtonCount
        count={count}
        onClick={() => {
          setCount(count + 1);
        }}
      />

      <ExpensiveComponent />
    </>
  );
}

function ButtonCount({ count, onClick }) {
  return (
    <>
      <p>Value: {count}</p>
      <button onClick={onClick}>Increment</button>
    </>
  );
}

export default App;
