import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Security middleware
export const securityMiddleware = [
  // Set security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
  
  // Sanitize data against NoSQL query injection
  mongoSanitize(),
  
  // Sanitize data against XSS
  xss(),
  
  // Prevent parameter pollution
  hpp(),
];

// Input validation middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid input data',
        errors: result.error.errors
      });
    }
    req.body = result.data;
    next();
  };
};

// File upload validation
export const validateFileUpload = (allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return (req, res, next) => {
    if (req.file) {
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: 'Invalid file type. Only images are allowed.'
        });
      }
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          message: 'File size too large. Maximum 5MB allowed.'
        });
      }
    }
    next();
  };
};
