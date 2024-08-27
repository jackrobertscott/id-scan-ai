export class StatusCodeError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export class InvalidAuthLogoutError extends StatusCodeError {
  constructor(message: string) {
    super(401, message)
  }
}

export class InsufficientPermissionError extends StatusCodeError {
  constructor(message: string) {
    super(403, message)
  }
}
