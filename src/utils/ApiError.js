class ApiError extends Error {
  constructor(statusCode, message = "something went wrong") {
    super(message);
    this.statusCode = statusCode;
    this.data = message;
  }
}

export { ApiError };
