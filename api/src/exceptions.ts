type ClientErrorStatusCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
type ServerErrorStatusCode = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511

type HttpStatusCodes = ClientErrorStatusCode | ServerErrorStatusCode

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: HttpStatusCodes = 500,
  ) {
    super(message)
    this.name = new.target.name
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class HomeNoMember extends AppError {
  constructor(message = 'Home has no ember') {
    super(message, 422)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
  }
}
