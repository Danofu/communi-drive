import { DataSnapshot } from 'firebase/database';
import { ZodSchema } from 'zod';

export default <T>(snapshot: DataSnapshot, schema: ZodSchema<T>) =>
  snapshot.exists() ? schema.parse(snapshot.val()) : null;
