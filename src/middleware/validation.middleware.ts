import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request
 * @param validations - Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (validations.length > 0) {
        await Promise.all(validations.map((validation) => validation.run(req)));
      }
  
      const errors = validationResult(req);
  
      if (errors.isEmpty()) {
        return next();
      }
  
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    };
  };
  