import { ApiError } from "../utils/api.error.js";

/**
 * Express middleware that validates req.body against a Zod schema.
 * On failure it throws an ApiError with all validation messages.
 * @param {import("zod").ZodSchema} schema
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    throw new ApiError(422, "Validation failed", errors);
  }

  // Replace req.body with the parsed (and stripped of unknown keys) data
  req.body = result.data;
  next();
};

export { validate };

