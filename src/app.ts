import express from 'express'
import config from 'config'
import connect from './utils/connect';
import logger from './utils/logger'
import routes from './routes';
require('dotenv').config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.listen(port, async () => {
    await connect();
    logger.info(`Listening on port ${port}`);
    console.log("connected");
})

routes(app);