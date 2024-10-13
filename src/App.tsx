import { useEffect, useMemo, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const doubleCount = useMemo(() => count * 2, [count]);

  useEffect(() => {
    console.log("Count value in React: ", count);
  }, [count]);

  return (
    <>
      <h1>React app ⚛️</h1>
      <p>Value: {count}</p>
      <p>Double Value: {doubleCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}

export default App;
