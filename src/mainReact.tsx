import ReactDOM from "react-dom/client";
import App from "./AppOptimized.tsx";
// import App from "./App.tsx";
// import App from "./AppFast.tsx";
// import App from "./AppSlow.tsx";

const rootElement = document.getElementById("react") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
