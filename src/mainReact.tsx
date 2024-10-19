import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootElement = document.getElementById("react") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
