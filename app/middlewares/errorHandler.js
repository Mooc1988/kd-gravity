'use strict'

module.exports = function * (next) {
  try {
    yield next
    const status = this.status || 404
    if (status === 404) {
      this.status = 404
      if (process.env.NODE_ENV === 'development') {
        this.body = this.config.apidoc
      } else {
        this.throw(404)
      }
    }
  } catch (err) {
    this.app.emit('error', err, this)
    if (err.message === 'Validation error') {
      this.status = 400
      this.body = err.errors[0]
    } else {
      this.body = {message: err.message}
      this.status = err.status || 500
      if (this.status >= 500) {
        console.error('request url: ', this.url)
        console.error('request body: ', this.request.body)
        console.error('request header: ', this.header)
        console.error()
      }
    }
  }
}
