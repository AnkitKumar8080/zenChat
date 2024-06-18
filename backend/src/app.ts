import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { corsUrl, environment } from "./config";
import authRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import "./database"; // initialize database
import { ApiError, ErrorType, InternalError } from "./core/ApiError";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { initSocketIo, emitSocketEvent } from "./socket";
import path from "path";

const app = express();

// creation of http server
const httpServer = createServer(app);

// express app middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({ origin: corsUrl, optionsSuccessStatus: 200, credentials: true })
);
app.use(morgan("dev"));
app.use(cookieParser());

// auth Routes
app.use("/auth", authRoutes);

// chat Routes
app.use("/api/chat", chatRoutes);

// message Routes
app.use("/api/messages", messageRoutes);

// create a static route to serve static images
app.use("/public", express.static("public"));

// creating a socket server
const io = new SocketServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: corsUrl,
    credentials: true,
  },
});

// initialize the socker server
initSocketIo(io);

app.set("io", io); // using set method to mount 'io' instance on app

// middleware error handlers
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      console.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}` +
          "\n" +
          `Error Stack: ${err.stack}`
      );
  } else {
    console.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}` +
        "\n" +
        `Error Stack: ${err.stack}`
    );
    if (environment === "development") {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default httpServer;
