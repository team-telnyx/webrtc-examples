import { Component } from "@angular/core";
import { INotification, TelnyxRTC } from "@telnyx/webrtc";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-web-dialer",
  templateUrl: "./web-dialer.component.html",
  styleUrls: ["./web-dialer.component.css"],
})
export class WebDialerComponent {
  log = "";
  client: TelnyxRTC;
  notification: any;

  constructor() {
    const client = new TelnyxRTC({
      login: environment.login,
      password: environment.password,
      login_token: environment.login_token,
    });

    client.remoteElement = "audioStream";
    client.enableMicrophone();

    client.on("telnyx.ready", () => {
      this.log = "registered";

      console.log("registered");
    });

    client.on("telnyx.error", (error: any) => {
      console.error(error);
      this.log = "";
      this.client.disconnect();
    });

    client.on("telnyx.socket.close", (close: any) => {
      console.error(close);
      this.log = "";
      if (client) {
        client.off("telnyx.error");
        client.off("telnyx.ready");
        client.off("telnyx.notification");
        client.off("telnyx.socket.close");
      }
    });

    client.on("telnyx.notification", (notification: INotification) => {
      switch (notification.type) {
        case "callUpdate":
          if (notification.call) {
            this.notification = notification;
            this.log = this.notification.call.state;
            console.log("this.notification===>", this.notification);
          }
          break;
        case "userMediaError":
          // Permission denied or invalid audio/video params on `getUserMedia`
          alert(
            `${notification.error}. \nPlease check if your devices (i.e. microphone or webcam) are plugged.`
          );
          break;
        default:
          break;
      }
    });

    this.client = client;
  }

  connect() {
    this.log = "Connecting...";
    this.client.connect();
  }

  call() {
    if (this.client) {
      this.client.newCall({
        destinationNumber: environment.destinationNumber,
      });
    }
  }

  hangup() {
    if (this.notification && this.notification.call) {
      this.notification.call.hangup();
    }
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
