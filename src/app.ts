import connect from './utils/connect';
import logger from './utils/logger'
import createServer from './utils/server'
import config from 'config'
import swaggerDocs from './utils/swagger';

require('dotenv').config();

const port = config.get<number>("port");

const app = createServer();

swaggerDocs(app, port);

app.listen(port, async () => {
    await connect();
    logger.info(`Listening on port ${port}`);
    console.log("connected");
})
