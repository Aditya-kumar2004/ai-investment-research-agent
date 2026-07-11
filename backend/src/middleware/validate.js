/**
 * Request Validation Middleware
 * Validates request body, query params, or route parameters against a Zod schema.
 * Sends a structured 400 Bad Request error if validation fails.
 */
export default function validate(schema) {
  return (req, res, next) => {
    try {
      // Validate request body
      schema.parse(req.body);
      next();  //why we havee writen next() 
    } catch (error) {
      // Format validation errors nicely
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }
  };
}
