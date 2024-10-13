import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>React app ⚛️</h1>
      <p>Value: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}

export default App;
