import * as Joi from 'joi';
import configFactory from '../utils/factories/configFactory';

const databaseConfigSchema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().integer().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  database: Joi.string().required(),
  synchronize: Joi.boolean().required(),
});

const databaseConfig = () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
});

export default configFactory('database', databaseConfig, databaseConfigSchema);
