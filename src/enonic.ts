import { Either, parseJSON, chain, filterOrElse } from "fp-ts/lib/Either";
import { pipe} from "fp-ts/lib/pipeable";
import { Error } from 'enonic-fp/lib/common';
import { request, HttpRequestParams, HttpResponse } from 'enonic-fp/lib/http';
import { EurobateParams, EurobateResponse } from "./index";

export function json(str: string) : Either<Error, any> {
  return parseJSON<Error>(str, reason => ({ errorKey: "BadRequestError", cause: String(reason) }));
}

export function sendSMS(params: EurobateParams): Either<Error, EurobateResponse> {
  const requestParams : HttpRequestParams = {
    url: 'https://api.eurobate.com/json_api.php',
    method: 'POST',
    body: JSON.stringify(params),
    contentType: 'application/json',
    connectionTimeout: 20000,
    readTimeout: 5000
  };

  return pipe(
    request(requestParams),
    chain((res: HttpResponse) => json(res.body)),
    filterOrElse(
      (res: EurobateResponse) => res.STATUS !== 'ERROR',
      e => ({ errorKey: "BadGatewayError", cause: String(e) }) as Error
    )
  );
}
