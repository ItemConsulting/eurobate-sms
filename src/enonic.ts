import {Either, tryCatch, parseJSON} from "fp-ts/lib/Either";
import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import {EurobateParams, EurobateResponse} from "./index";

let httpClientLib : any;

try {
  // @ts-ignore
  httpClientLib = __non_webpack_require__('/lib/http-client');
} catch {
  httpClientLib = null;
}

interface Error {
  key: string
  message: string
}

function json(str: string): Either<Error, any> {
  return parseJSON<Error>(str, e => ({
      key: 'ClientError',
      message: String(e)
  }));
}

export function sendSMS(params: EurobateParams): Either<Error, EurobateResponse> {
  const requestParams = {
    url: 'https://api.eurobate.com/json_api.php',
    method: 'POST',
    body: JSON.stringify(params),
    contentType: 'application/json',
    connectionTimeout: 20000,
    readTimeout: 5000
  };

  return pipe(
    tryCatch(
      () => httpClientLib.request(requestParams),
      e => ({
        key: 'InternalServerError',
        message: String(e)
      })
    ),
    E.chain(res => json(res.body)),
    E.filterOrElse(
      (res: EurobateResponse) => res.STATUS !== 'ERROR',
      e => ({
          key: 'BadGatewayError',
          message: String(e)
      })
    )
  );
}
