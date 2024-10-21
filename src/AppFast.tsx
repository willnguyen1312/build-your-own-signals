import { useSignal, useSignals } from "./signalsReactObject";

function ExpensiveComponent() {
  console.log("ExpensiveComponent rendered");
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
      <ButtonCount
        count={count}
        onClick={() => {
          count.value++;
        }}
      />

      <ExpensiveComponent />
    </>
  );
}

function ButtonCount({ count, onClick }) {
  useSignals();
  return (
    <>
      <p>Value: {count.value}</p>
      <button onClick={onClick}>Increment</button>
    </>
  );
}

export default App;
