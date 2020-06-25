import {parseJSON} from "fp-ts/lib/Either";
import {IOEither, fromEither, chain, filterOrElse, map} from "fp-ts/lib/IOEither";
import * as EI from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import {EnonicError} from 'enonic-fp/lib/errors';
import {request} from 'enonic-fp/lib/http';
import {EurobateParams, EurobateResponse} from "./index";
import {HttpResponse} from "enonic-types/lib/http";


export function sendSMS(params: EurobateParams): IOEither<EnonicError, EurobateResponse> {
  return pipe(
    request({
      url: 'https://api.eurobate.com/json_api.php',
      method: 'POST',
      body: JSON.stringify(params),
      contentType: 'application/json',
      connectionTimeout: 20000,
      readTimeout: 5000
    }),
    map((res: HttpResponse) => res.body),
    chain(
      fromNullable(
        createBadGatewayError("No response body from Eurobate")
      )
    ),
    chain((body: string) =>
      fromEither(
        parseJSON<EnonicError>(
          body,
          createBadGatewayError
        )
      )
    ),
    filterOrElse(
      isEurobateResponse,
      createBadGatewayError
    )
  );
}

function createBadGatewayError(reason: unknown): EnonicError {
  return {
    errorKey: "BadGatewayError",
    cause: String(reason)
  }
}

function isEurobateResponse(res: unknown): res is EurobateResponse {
  return res !== undefined
    && res !== null
    && Array.isArray((res as EurobateResponse).messages)
    && (res as EurobateResponse).STATUS !== 'ERROR'
}

export function fromNullable<E>(
  e: E
): <A>(a: A | null | undefined) => IOEither<E, A> {
  return <A>(a: A | null | undefined): IOEither<E, A> => fromEither(EI.fromNullable(e)(a));
}
