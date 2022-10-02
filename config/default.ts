import * as dotenv from "dotenv";
dotenv.config();

export default {
    port: 1337,
    dbUri: "mongodb://localhost:27017/backend-assignment-enso",
    accessTokenTtl: '1y',
    privateKey: process.env.PRIVATE_KEY as string,
    pathToCount: "./count.txt"
}