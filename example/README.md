# Zetrix DIDComm Browser Demo

## Overview

The Zetrix DIDComm v2 application capable of both sending and receiving messages through a DIDComm v2 capable mediator. The primary goal of the demo is to simplify the understanding of [DID Communication](https://didcomm.org) (DIDComm) principles by implementing only essential protocols.

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

**DID Support:**
Currently, only `did:zid:` DIDs are supported. Upon page load, a new `did:zid:` DID is generated, which connects to a mediator to negotiate mediation.

## Getting Started

### Prerequisites

Before you can run or build the DIDComm Browser Demo, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

install the dependencies:

`npm install`  # Or use `yarn install` if you prefer yarn over npm

### Configuration

create .env file contains:

`VUE_APP_API_BASE_URL=https://test-api.zetrix.com`
`VUE_APP_WS_URL=https://test-ws.zetrix.com/ws`

### Running the Application

To run the application locally:

`npm run serve`  # Or `yarn serve`

This command starts a local development server. Open http://localhost:8080 in your browser to view the application.

### Building the Application

To build the application for production:

`npm run build`  # Or `yarn build`

This will bundle the application into static files in the `dist/` directory.