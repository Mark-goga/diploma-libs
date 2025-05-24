export const GENERAL_ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNKNOWN_ERROR: 'Unknown error',
  VALIDATION_ERROR: 'Validation error',
  CONFLICT: 'Conflict',
  NOT_FOUND: 'Resource not found',
  AUTHORIZATION_NOT_FOUND: 'Authorization header not found',
  BEARER_OR_TOKEN_NOT_FOUND: 'Bearer or token not found',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  YUO_DONT_HAVE_PERMISSION_TO_ACCESS_THIS_RESOURCE:
    "You don't have permission to access this resource",
  INVALID_NUMBER_VALUE: 'Invalid value. Please provide a valid number.',
} as const;
