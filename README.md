# Zetrix DIDComm Package

## Overview

The Zetrix DIDComm is for client message wrapper that support an essential protocols.

### Supported Protocols

**Mediation Protocols:**

- [Coordinate Mediation 3.0](https://didcomm.org/coordinate-mediation/3.0/)
- [Message Pickup 3.0](https://didcomm.org/messagepickup/3.0/)

**Core Protocols:**

- [Routing 2.0](https://didcomm.org/routing/2.0/)
- [Discover Features 2.0](https://didcomm.org/discover-features/2.0/)
- [Trust Ping 2.0](https://didcomm.org/trust-ping/2.0/)

**Utility Protocols for Enhanced Usability:**

- [Basic Message 2.0](https://didcomm.org/basicmessage/2.0/)

**Verifiable Presentation Protocols for Present Proof:**

- [Present Proof 3.0](https://didcomm.org/present-proof/3.0/)

## Getting Started

### Prerequisites

Before you can run or build the DIDComm Browser Demo, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

install the dependencies:

`npm install`  # Or use `yarn install` if you prefer yarn over npm

### Link Library

run `make link` or `npm link zetrix-didcomm`


### Testing the Package

To test protocol:

`make test-all`  # Or `npm test`

To test by protocol:

`make test-basicmessage` Or `npm test test/basicmessage.test.js`

`make test-<protocolName>` Or `npm test test/<fileName>`

### Example

To create basic message protocol:
```js
const createBasicMessage = basicMessage.createBasicMessage(
      "did:example:alice",
      "did:example:bob",
      "Hi Bob! How are you?",
    );
```
To pack message with JWE (JSON Web Encryption):
```js
const packAuthMsg = packMessage.packAuthCrypt(<Sender_privateKey_In_Zetrix>, <Recipient_publicKey_X25519_In_Base58>, "did:example:alice#key-2", "did:example:bob#key-2", createBasicMessage);
```
To unpack JWE (JSON Web Encryption) message to JWM (JSON Web Messages):
```js
const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, <Recipient_privateKey_In_Zetrix>, <Sender_publicKey_X25519_In_Base58>);
```

### DIDComm Demo Project Example

Can refer folder example for DIDComm Demo running on Vue.js

install the dependencies:

`cd example`

`npm install`  # Or use `yarn install` if you prefer yarn over npm

run the application:
`npm run serve`  # Or use `yarn serve`