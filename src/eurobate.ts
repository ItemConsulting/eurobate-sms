export interface EurobateParams {
  user: string
  password: string
  simulate?: 0 | 1
  ttl?: number
  messages: Array<EurobateMessage>
}

export interface EurobateMessage {
  originator: string,
  msisdn: string,
  message: string
}

export interface EurobateResponse {
  ttl: number,
  simulate: number,
  LOGON: string,
  STATUS?: string
  REASON?: string,
  messages: Array<EurobateMessageResponse>
}

export interface EurobateMessageResponse {
  msisdn: number,
  transactionid: number,
  error: number,
  info: string,
  messageParts: string
}
