import app from './server';
import logger from './log/logger';

const port = process.env.PORT || 4545; // default port to listen

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

