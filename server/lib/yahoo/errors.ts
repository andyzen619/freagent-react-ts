export interface YahooApiErrorBody {
  error: {
    lang: string;
    description: string;
  };
}

export class YahooApiError extends Error {
  public errorBody: YahooApiErrorBody;

  constructor(message: string, errorBody: YahooApiErrorBody) {
    super(message);
    this.name = "YahooApiError";
    this.errorBody = errorBody;
  }
}
