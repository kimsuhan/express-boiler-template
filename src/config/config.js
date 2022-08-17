import dotenv from 'dotenv';
import path from 'path';
import joi from 'joi';

const __dirname = path.resolve();

dotenv.config({ path: path.join(__dirname, `/.env.${process.env.NODE_ENV}`) });

const envVarsSchema = joi
    .object()
    .keys({
        NODE_ENV: joi.string().valid('production', 'development', 'test', 'local').required(),
        PORT: joi.string().default(3000),
        LOG_PATH: joi.string().required(),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ convert: false }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    log_path: envVars.LOG_PATH,
};
