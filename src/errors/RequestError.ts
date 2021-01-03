class RequestError extends Error {
  public data: string;
  public status: number;
  public statusText: string;
  constructor(message: ClientResponse) {
    super(JSON.stringify(message));
    try {
      const response = JSON.parse(this.message);
      this.data = response.data;
      this.status = response.status;
      this.statusText = response.statusText;
    } catch (_e) {
      this.status = 500;
      this.data = this.message;
      this.statusText = 'Internal Server Error';
    }
  }

  response() : ClientResponse {
    return {
      status: this.status,
      statusText: this.statusText,
      data: this.data,
    };
  }
}
export default RequestError;
