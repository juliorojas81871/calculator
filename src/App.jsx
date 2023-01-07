import "./App.css";
import React, { useReducer } from "react";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-degit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  NEGATIVE: "negative",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite === true) {
        // this will delete the evaualtion once the user click a new number
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // if the first digit is 0 it won't add another digit
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      // will make sure that there is only one "."
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        // add the new digit to the current digit
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      // won't allow user to pick an Operation if empty
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      // to overwrite an operation if the user pick the wrong one
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      // for the first operation used
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // evrytime you pick an operation after the first on, the program will do the calcation
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: state.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      // if something is missing, the program will just return the current state
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.NEGATIVE:
      if (state.currentOperand.charAt(0) === "-") {
        return {
          ...state,
          currentOperand: state.currentOperand.substring(1),
        };
      
      }
      return {
        ...state,
        currentOperand: "-" + state.currentOperand,
      };
  }
};

// this doesn't like decimal, that why we need the formatOperand
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  // parseFloat() parses a string and returns the first number:
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  // "isNaN" check if it not a number
  if (isNaN(prev) || isNaN(current)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "x":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    case "-":
      computation = prev - current;
      break;
  }
  // toString because
  return computation.toString();
};

const App = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="container">
      <div className="wrapper">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <div
          className="btn light-gray"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </div>
        <div
          className="btn light-gray"
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </div>
        <div
          className="btn light-gray"
          onClick={() => dispatch({ type: ACTIONS.NEGATIVE })}
        >
          +/-
        </div>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="x" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <div
          className="btn equal"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </div>
      </div>
    </div>
  );
};

export default App;
