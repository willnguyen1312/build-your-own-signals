export const createApp = () => {
  const app = document.createElement("div");
  let value = 0;
  let doubleValue = value * 2;

  app.innerHTML = `
    <h1>Vanilla app 🍦</h1>
    <p id="value">Value: ${value}</p>
    <p id="doubleValue">Double Value: ${doubleValue}</p>
    <button id="increment">Increment</button>
  `;

  app.querySelector("button#increment")?.addEventListener("click", () => {
    value++;
    doubleValue = value * 2;
    app.querySelector("p#value")!.textContent = `Value: ${value}`;
    app.querySelector(
      "p#doubleValue"
    )!.textContent = `Double Value: ${doubleValue}`;

    console.log("Count value in Vanilla: ", value);
  });

  document.body.appendChild(app);
  return app;
};

createApp();
