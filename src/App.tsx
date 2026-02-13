import React from "react";
import { Toaster } from "react-hot-toast";
import AgentSystemComponent from "./components/AgentSystem";
import { ReduxProvider } from "./store/ReduxProvider";
import "./index.css";

const App = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <ReduxProvider>
        <Toaster position="top-right" />
        <AgentSystemComponent />
      </ReduxProvider>
    </div>
  );
};

export default App;
