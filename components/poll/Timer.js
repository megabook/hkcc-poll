import { useState } from "react";
import moment from "moment";

import Countdown from "react-countdown";

//Random component
const Completionist = () => <h1 className="text-center">Times Up!</h1>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <>
        <div className="text-center">
          {/* <span> {hours}:{minutes}:{seconds}</span> */}
          <h1 className="text-danger">{seconds}</h1>
          <span className="text-muted text-uppercase">Second</span>
        </div>
      </>
    );
  }
};

const Timer = (props) => {
  const { duration } = props;

  const length = duration * 1000;

  return (
    <div>
      <Countdown date={Date.now() + length} renderer={renderer}  />
    </div>
  );
};

export default Timer;
