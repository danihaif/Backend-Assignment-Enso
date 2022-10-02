import * as dotenv from "dotenv";
dotenv.config();

export default {
    port: 1337,
    accessTokenTtl: '1y',
    privateKey: process.env.PRIVATE_KEY as string
}