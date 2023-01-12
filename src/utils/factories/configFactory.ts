import { registerAs } from '@nestjs/config';
import { Schema } from 'joi';

export default (token: string, config: () => object, schema: Schema) => {
  return registerAs(token, () => {
    const values = config();
    const { error } = schema.validate(values, { abortEarly: false });

    if (error) {
      throw new Error(
        `Validation failed - Is there an environment or config variable missing?
      ${error.message}`,
      );
    }

    return values;
  });
};
