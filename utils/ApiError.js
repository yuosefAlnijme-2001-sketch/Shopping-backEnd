// @desc this is class is responsible
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith(4) ? 'file' : 'error'
    this.isOperational = true
  }
}

module.exports = ApiError
