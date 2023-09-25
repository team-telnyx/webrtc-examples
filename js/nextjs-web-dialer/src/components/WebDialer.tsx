import React, { useEffect, useState } from "react";
import CallLog from "./CallLog";
import Phone from "./Phone";
import { TelnyxRTC } from "@telnyx/webrtc";

export const WebDialer = () => {
  const clientRef = React.useRef<any>(null);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [callNotification, setCallNotification] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== undefined) {
      setLoading(false);
    }
  }, []);

  const [credential, setCredential] = useState({
    // Create a .env file with REACT_APP_TELNYX_LOGIN_TOKEN
    // set to your On-Demand Credential Token to try this out
    // https://developers.telnyx.com/docs/v2/webrtc/quickstart
    //     login_token: process.env..NEXT_PUBLIC_TELNYX_LOGIN_TOKEN || "mytoken",
    login: process.env.NEXT_PUBLIC_TELNYX_USERNAME!,
    password: process.env.NEXT_PUBLIC_TELNYX_PASSWORD!,
  });

  useEffect(() => {
    try {
      //@ts-ignore
      clientRef.current = new TelnyxRTC(credential);
      //@ts-ignore
      window.telnyxWebRTCClient = clientRef.current;
      clientRef.current.on("telnyx.ready", () => {
        console.log("telnyx.ready");
      });

      clientRef.current.on("telnyx.error", (error: any) => {
        console.log("telnyx.error", error);
      });

      clientRef.current.on("telnyx.notification", (notification: any) => {
        console.log("telnyx.notification", notification);
      });

      clientRef.current.on("telnyx.socket.error", (error: any) => {
        console.log("telnyx.socket.error", error);
      });

      clientRef.current.on("telnyx.notification", (notification: any) => {
        console.log("telnyx.notification", notification);
        setCallNotification(notification);
        switch (notification.type) {
          case "callUpdate": {
            if (notification.call.state === "ringing") {
              setTimeout(() => {
                notification.call.answer();
              }, 2000);
            }
            if (notification.call.state === "active") {
              setCurrentCall(notification.call);
            }
            if (notification.call.state === "done") {
            }
          }
        }
      });

      clientRef.current.connect();
    } catch (error) {
      console.error(error);
    }
  }, [credential]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setCredential((state) => ({ ...state }));
  };

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        "Loading...."
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <button type="submit">Connect</button>
          </form>

          <CallLog callNotification={callNotification} />
          <Phone client={clientRef.current} currentCall={currentCall} />
        </div>
      )}
    </div>
  );
};
