export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} non trouvé`);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(403, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(401, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
