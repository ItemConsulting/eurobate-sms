import { parseJSON } from "fp-ts/lib/Either";
import { IOEither, fromEither, chain, filterOrElse } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from 'enonic-fp/lib/common';
import { request } from 'enonic-fp/lib/http';
import { EurobateParams, EurobateResponse } from "./index";
import {HttpRequestParams, HttpResponse} from "enonic-types/lib/http";

export function json(str: string) : IOEither<EnonicError, any> {
  return fromEither(
    parseJSON<EnonicError>(str, (reason) => (
      {
        errorKey: "BadGatewayError",
        cause: String(reason)
      })
    )
  );
}

export function sendSMS(params: EurobateParams): IOEither<EnonicError, EurobateResponse> {
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
    chain((res: HttpResponse) => json(res.body!)),
    filterOrElse(
      (res: EurobateResponse) => res.STATUS !== 'ERROR',
      e => (
        {
          errorKey: "BadGatewayError",
          cause: String(e)
        }
      ) as EnonicError
    )
  );
}
