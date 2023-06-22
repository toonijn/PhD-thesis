import http from "http";
import { Server } from "socket.io";

const io = new Server(http.createServer(), {
  cors: {
    origin: "*",
  },
});
io.listen(2345);

io.on("connection", (socket) => {
  socket.on("change_slide", (data: any) => {
    console.log("change_slide", data);
    io.emit("slide_changed", data);
  });
});
