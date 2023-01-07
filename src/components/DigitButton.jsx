import React from "react";
import { ACTIONS } from "../App";

const DigitButton = ({ dispatch, digit }) => {
  return (
    <div
      className="btn"
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </div>
  );
};

export default DigitButton;
