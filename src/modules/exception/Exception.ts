import { ErrorCode } from './ErrorCode';
import { HttpStatus } from './HttpStatus';

export class Exception extends Error {
  public httpCode: number;
  public errors: any | null;

  constructor(code: string = ErrorCode.UnknownError, errors: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.httpCode = HttpStatus.NOT_IMPLEMENTED;
    this.errors = errors;
    switch (code) {
      case ErrorCode.ValidationError:
        this.httpCode = HttpStatus.BAD_REQUEST;
        break;
      case ErrorCode.BadRequestError:
        this.httpCode = HttpStatus.BAD_REQUEST;
        break;
      case ErrorCode.Unauthenticated:
        this.httpCode = HttpStatus.UNAUTHORIZED;
        break;
      case ErrorCode.AccessDenied:
        this.httpCode = HttpStatus.FORBIDDEN;
        break;
      case ErrorCode.NotFound:
        this.httpCode = HttpStatus.NOT_FOUND;
        break;
      default:
        this.httpCode = HttpStatus.NOT_IMPLEMENTED;
        break;
    }
  }

  public getDetails() {
    return  {
      httpCode: this.httpCode,
      success:false,
      errors: this.errors
    };
  }
}
