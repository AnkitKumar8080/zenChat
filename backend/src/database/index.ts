import mongoose from "mongoose";
import { db } from "../config";

// db con URI
const dbURI = `${db.url}/${db.name}`;

// additional configuration option for db
const options = {
  minPoolSize: db.minPoolSize,
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 45000,
};

mongoose.set("strictQuery", true);

function setRunValidators(this: any): void {
  this.setOptions({ runValidators: true });
}

// create a connection to the database
mongoose
  .plugin((schema: any) => {
    schema.pre("findOneAndUpdate", setRunValidators);
    schema.pre("updateMany", setRunValidators);
    schema.pre("updateOne", setRunValidators);
    schema.pre("update", setRunValidators);
  })
  .connect(dbURI, options)
  .then(() => {
    console.log("mongoose connection done");
  })
  .catch((e) => {
    console.error("mongoose connection error: " + e.message);
  });

// connection events
mongoose.connection.on("connected", () => {
  console.log("mongoose connection opened : " + mongoose.connection.host);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection disconnected");
});

export const connection = mongoose.connection;
