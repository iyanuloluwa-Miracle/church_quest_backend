import { Request, Response, NextFunction } from 'express';

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email';
  minLength?: number;
  maxLength?: number;
  in?: 'body' | 'query' | 'params';
  min?: number;
  max?: number;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { field: string; message: string }[] = [];

    rules.forEach((rule) => {
      const source = rule.in === 'query' ? req.query : 
                    rule.in === 'params' ? req.params : 
                    req.body;
      
      let value = source[rule.field];

      // Convert query string numbers
      if (rule.type === 'number' && typeof value === 'string') {
        value = Number(value);
        if (!isNaN(value)) {
          source[rule.field] = value;
        }
      }

      // Check required fields
      if (rule.required && (value === undefined || value === '')) {
        errors.push({
          field: rule.field,
          message: `${rule.field} is required`,
        });
        return;
      }

      // Skip other validations if field is not required and empty
      if (!rule.required && (value === undefined || value === '')) {
        return;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a string`,
              });
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a number`,
              });
            } else {
              const numValue = Number(value);
              if (rule.min !== undefined && numValue < rule.min) {
                errors.push({
                  field: rule.field,
                  message: `${rule.field} must be at least ${rule.min}`,
                });
              }
              if (rule.max !== undefined && numValue > rule.max) {
                errors.push({
                  field: rule.field,
                  message: `${rule.field} must be at most ${rule.max}`,
                });
              }
            }
            break;
          case 'email':
            if (!validateEmail(value)) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a valid email address`,
              });
            }
            break;
        }
      }

      // Length validation for strings
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at least ${rule.minLength} characters long`,
          });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at most ${rule.maxLength} characters long`,
          });
        }
      }
    });

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
      return;
    }

    next();
  };
};