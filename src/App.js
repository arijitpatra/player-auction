import React, { useState } from "react";
import { randomId } from "./appConstants";
import Header from "./components/header/index";
import Profile from "./components/profile/index";
import "./App.scss";

function App() {
  const [isPasscodeValid, setPassCode] = useState(false);
  return (
    <div className="App">
      <Header />
      {isPasscodeValid ? (
        <Profile />
      ) : (
        <div className="password">
          <input
            type="password"
            className="password-input"
            placeholder="password"
            onChange={e => {
              if (e.target.value === randomId) {
                setPassCode(true);
              }
            }}
          ></input>
        </div>
      )}
    </div>
  );
}

export default App;
