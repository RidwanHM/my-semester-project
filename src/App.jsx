import { Outlet } from "@tanstack/react-router";
import "./App.css";

function App() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <footer></footer>
    </>
  );
}

export default App;
