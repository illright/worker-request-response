# `worker-request-response` 👷‍♀️💬🗨️

![npm version](https://img.shields.io/npm/v/worker-request-response)
![minzipped package size](https://img.shields.io/bundlephobia/minzip/worker-request-response.svg)

_Ever wish you could request some data from a service/web worker and have them respond to you asynchronously?_

A Promise API for submitting requests to workers and tracking responses.

## Installation

```bash
pnpm add worker-request-response
```

Type definitions are built in 😎.

<details>
  <summary>I don't use <code>pnpm</code></summary>

What do you mean "I don't use [`pnpm`](https://pnpm.io)"? It's so much faster! Alright, here's your `npm` command:

```bash
npm install --save worker-request-response
```

</details>

## Usage

It has two functions exported: 
* `sendRequest` for your main thread code
* `handleRequestsWith` for your worker code

Here's an example of a service worker that converts numbers to strings:

```ts
// In your main thread
import { sendRequest } from 'worker-request-response';

export async function sendRequestToServiceWorker() {
  const response = await sendRequest<number, string>(navigator.serviceWorker.controller, 42);
  console.log(response, 'is "42"');
}
```

```ts
// In your worker
import { handleRequestsWith } from 'worker-request-response';

async function processRequest(event: MessageEvent<number>): Promise<string> {
  return event.data.toString();
}

self.addEventListener('message', handleRequestsWith(processRequest));
```

There, that simple. In glorious TypeScript, too.

### Usage with web workers

The `sendRequest` function accepts the worker object as the first argument. For service workers, you would pass `navigator.serviceWorker.controller` (checking for null beforehand). For web workers, you would pass the instance of your worker.

```ts
// In your main thread
import { sendRequest } from 'worker-request-response';
import { yourWorker } from './somewhere';

async function() {
  const response = await sendRequest<number, string>(
    yourWorker
    42,
  );
}
```

### Asynchronous request handler in the worker

The request handler that you pass into `routeResponse` can be synchronous or asynchronous — in the latter case the resulting promise is awaited before being sent back.

## License

The source code of this project is distributed under the terms of the ISC license. It's like MIT, but better. [Click here](https://choosealicense.com/licenses/isc/) to learn what that means.
