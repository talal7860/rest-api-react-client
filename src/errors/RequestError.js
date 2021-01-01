class RequestError extends Error {
  constructor(message) {
    super(JSON.stringify(message));
  }

  parsedMessage() {
    try {
      return JSON.parse(this.message);
    } catch (_e) {
      return this.message;
    }
  }
}
export default RequestError;
