import { fieldError } from "./fieldError";

export const mapFormErrors = (fieldErrors: fieldError[]) => {
  const errors: { [key: string]: string } = {};
  fieldErrors.map(({ field, message }) => {
    if (errors[field] === undefined) {
      errors[field] = message;
    }
  });
  return errors;
};
