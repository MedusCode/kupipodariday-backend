import * as Joi from 'joi';
import configFactory from '../utils/factories/configFactory';

const jwtConfigSchema = Joi.object({
  secret: Joi.string().required(),
  lifespan_in_days: Joi.number().integer().required(),
});

const jwtConfig = () => ({
  secret: process.env.JWT_SECRET,
  lifespan_in_days: parseInt(process.env.JWT_LIFESPAN_IN_DAYS, 10) || 7,
});

export default configFactory('jwt', jwtConfig, jwtConfigSchema);
