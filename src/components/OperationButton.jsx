import React from "react";
import { ACTIONS } from "../App";
import "../App.css"

const OperationButton = ({ dispatch, operation }) => {
  return (
    <div
      className="btn orange"
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </div>
  );
};

export default OperationButton;
