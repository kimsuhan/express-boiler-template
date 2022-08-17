import app from './app.js';
import logger from './config/logger.js';
import conf from './config/config.js';

app.listen(conf.port, () => {
    logger.info(`Listening to port ${conf.port}`);
});
