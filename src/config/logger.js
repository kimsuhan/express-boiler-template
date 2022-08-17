import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import config from './config.js';

const logPath = config.log_path;
const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [
        // info Log
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logPath,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // error Log
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logPath + '/error', // error.log 파일은 /logs/error 하위에 저장
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

if (config.env !== 'production') {
    logger.add(
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
    );
}

export default logger;
