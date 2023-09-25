import React, { useEffect, useState } from "react";
import { TelnyxRTC } from "@telnyx/webrtc";

const Phone = ({
  client,
  currentCall,
}: {
  client: TelnyxRTC;
  currentCall: any;
}) => {
  const [destination, setDestination] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      const call = client?.newCall({
        destinationNumber: destination,
        callerName: process.env.REACT_APP_TELNYX_PHONE_NUMBER || "",
        callerNumber: process.env.REACT_APP_TELNYX_PHONE_NUMBER || "",
        audio: true,
        video: false,
      });

      console.log("newCall: ", call);
    } catch (err) {
      console.error(err);
    }
  };

  const call = currentCall;
  const callState = call?.state;

  useEffect(() => {
    console.log("phone callState:", callState);
  }, [callState]);

  return (
    <div>
      <strong>Voice call</strong>
      <form onSubmit={handleSubmit}>
        <input
          name="destination_phone_number"
          type="tel"
          placeholder="1-555-123-4567"
          value={destination}
          onChange={(e: any) => setDestination(e.target.value)}
        />
        <button type="submit">Call</button>
        {call && call.state !== "destroy" && (
          <button type="button" onClick={() => call.hangup()}>
            Hangup
          </button>
        )}
      </form>

      <audio autoPlay src={call?.remoteStream} />
    </div>
  );
};
export default Phone;
