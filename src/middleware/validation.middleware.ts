import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (validations.length > 0) {
      await Promise.all(validations.map((validation) => validation.run(req)));
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array(),
    });
  };
};