import { INotification } from "@telnyx/webrtc";
import React, { useState, useEffect } from "react";

const CallLog = ({ callNotification }: { callNotification: any }) => {
  let [clientStateLog, setClientStateLog] = useState<
    { type: string; state?: string; timestamp: number }[]
  >([]);

  useEffect(() => {
    console.log("notification:", callNotification);
    if (callNotification?.type !== "callUpdate") return;
    setClientStateLog((prevState) => [
      ...prevState,
      {
        type: callNotification.type,
        timestamp: Date.now(),
        state: callNotification.call?.state,
      },
    ]);
  }, [callNotification]);

  return (
    <ol>
      {clientStateLog.map((loggedState) => (
        <li key={loggedState.timestamp}>
          {loggedState.type}
          {loggedState.state && (
            <span>
              {" "}
              <strong>{loggedState.state}</strong>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};
export default CallLog;
