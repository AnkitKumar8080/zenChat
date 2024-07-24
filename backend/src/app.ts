import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { corsUrl, environment } from "./config";
import authRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import "./database"; // initialize database
import {
  ApiError,
  ErrorType,
  InternalError,
  RateLimitError,
} from "./core/ApiError";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { initSocketIo, emitSocketEvent } from "./socket";
import path from "path";
import { RateLimitRequestHandler, rateLimit } from "express-rate-limit";
import requestIp from "request-ip";

const app = express();

// creation of http server
const httpServer = createServer(app);

// middleware to get the ip of client from the request
app.use(requestIp.mw());

// Adding a rate limiter to the server
const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers which were used before
  keyGenerator: (req: Request, _: Response): string => {
    return requestIp.getClientIp(req) || ""; // Return the IP address of the client
  },
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    next(
      new RateLimitError(
        `You exceeded the request limit. Allowed ${options.max} requests per ${
          options.windowMs / 60000
        } minute.`
      )
    );
  },
});

// Apply  the rate limiter to all routes
app.use(limiter);

// express app middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: corsUrl,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

// HEALTH CHECK ROUTE
app.get("/health", (req, res) => {
  res.send("healthy running");
});

// auth Routes
app.use("/auth", authRoutes);

// chat Routes
app.use("/api/chat", chatRoutes);

// message Routes
app.use("/api/messages", messageRoutes);

// create a static route to serve static images
app.use("/public", express.static(path.join(__dirname, "..", "public")));

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
      return res.status(500).send(err.stack);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default httpServer;
