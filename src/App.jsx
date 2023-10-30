import { memo, useCallback, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  return (
    <>
      <h1>Example Closure Rerender</h1>
      <div className="card">
        <ClosureRerender setMessage={setMessage} />
      </div>
      <h1>Example No Rerender</h1>
      <div className="card">
        <NoRerender setMessage={setMessage} />
      </div>
      {message ? (
        <div className="flex items-center justify-center p-2">
          <h4 className="block max-w-sm m-3 p-6 bg-white border border-red-200 rounded-lg shadow hover:bg-red-100 dark:bg-red-800 dark:border-red-700 dark:hover:bg-red-700">
            {message}
          </h4>
        </div>
      ) : null}
    </>
  );
}

let closureRenderCount = 0;
function ClosureRerender(props) {
  const [count, setCount] = useState(0);
  closureRenderCount++;

  const onClickNumber = (number) => {
    props.setMessage(`Picked ${number} (rerender)`);
  };

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count} / render count {closureRenderCount}
      </button>
      <div className="flex items-center justify-center p-2">
        <ExpensiveNumber onClickNumber={onClickNumber} />
      </div>
    </>
  );
}

let noRerenderCount = 0;
function NoRerender(props) {
  const [count, setCount] = useState(0);
  noRerenderCount++;

  const onClickNumber = useCallback(
    (number) => {
      props.setMessage(`Picked ${number} (no rerender)`);
    },
    [props.setMessage],
  );

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count} / render count {noRerenderCount}
      </button>
      <div className="flex items-center justify-center p-2">
        <ExpensiveNumber onClickNumber={onClickNumber} />
      </div>
    </>
  );
}

/**
 * An expensive to render component, even if your component is memo'd if you pass closures as props
 */
function _ExpensiveNumber(props) {
  let array = new Uint32Array(5000);
  for (let _ of Array(10000).fill(0)) {
    crypto.getRandomValues(array);
  }
  const number = array[0];
  return (
    <h4
      className="cursor-pointer block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      onClick={() => props.onClickNumber(number)}
    >
      {number}
    </h4>
  );
}

const ExpensiveNumber = memo(_ExpensiveNumber);

export default App;
