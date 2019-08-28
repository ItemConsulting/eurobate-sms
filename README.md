# JavaScript library for Eurobate SMS

[![npm version](https://badge.fury.io/js/eurobate-sms.svg)](https://badge.fury.io/js/eurobate-sms)

This library provides a JavaScript/TypeScript wrapper around the Eurobate JSON APIs.

| WARNING: Do not use this library from client side JavaScript, since you will make your password public. |
| --- |

It comes on two flavors.

 * Axios for Node.js (Do not use it in client side JavaScript in the browser)
 * Enonic XP
 
### Usage in Node.js

Install with npm:

```bash
npm i eurobate-sms --save
```

You can now import the library and use the `sendSMS` function. The TypeScript typings will provide added code security
when using it in IDEs.

```javascript
const { sendSMS } = require('eurobate-sms');

sendSMS({
  messages: [
    {
      originator: 'Sender name',
      msisdn: '004740829232',
      message: 'Liten test'
    }
  ],
  user: "myUsername",
  password: "myPassword",
  simulate: 1,
  ttl: 3600
}).then(res => {
  console.log('Response from server:', res);
});
```

### Usage in Enonic

_Use npm to install the dependency._

```bash
npm i eurobate-sms --save
```

```javascript
import { enonicSendSMS } from 'eurobate-sms';
import * as E from "fp-ts/lib/Either";

const response = enonicSendSMS({
  messages: [
    {
      originator: 'Sender name',
      msisdn: '004740829232',
      message: 'Liten test'
    }
  ],
  user: "myUsername",
  password: "myPassword",
  simulate: 1,
  ttl: 3600
});

E.fold(
  (res) => console.log('Response from server:', res),
  (e) => console.error('Error:', e)
)(response)
```

## Building

To build the project run the following command:

```bash
npm run build
```
