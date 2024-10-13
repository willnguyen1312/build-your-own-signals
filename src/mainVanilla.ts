const createApp = () => {
  const app = document.createElement("div");
  let value = 0;

  app.innerHTML = `
    <h1>Vanilla app 🍦</h1>
    <p id="value">Value: ${value}</p>
    <button id="increment">Increment</button>
  `;

  app.querySelector("button#increment")?.addEventListener("click", () => {
    value++;
    app.querySelector("p#value")!.textContent = `Value: ${value}`;
  });

  document.body.appendChild(app);
  return app;
};

createApp();
