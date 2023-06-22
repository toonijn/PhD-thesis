import { Socket } from "socket.io-client";

const searchParams = new URLSearchParams(window.location.search);
const url = searchParams.get("sync");

let socket: Promise<Socket>;
if (url) {
  socket = import("socket.io-client").then((sio) => sio.io("ws://" + url));
} else {
  socket = new Promise(() => {});
}

export default class SyncSlides {
  constructor() {}

  listen(callback: (slideID: string) => void) {
    (async () => {
      (await socket).on("slide_changed", callback);
    })();
  }

  changed(slideID: string) {
    (async () => {
      (await socket).emit("change_slide", slideID);
    })();
  }
}
