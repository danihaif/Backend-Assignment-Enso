import connect from './utils/connect';
import logger from './utils/logger'
import createServer from './utils/server'

require('dotenv').config();

const port = process.env.PORT;

const app = createServer();

app.listen(port, async () => {
    await connect();
    logger.info(`Listening on port ${port}`);
    console.log("connected");
})
