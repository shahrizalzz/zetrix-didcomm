link:
	npm link zetrix-didcomm

test-all:
	npm test

test-basicmessage:
	npm test test/basicmessage.test.js

test-coordinate-mediation:
	npm test test/coordinate-mediation.test.js

test-discover-features:
	npm test test/discover-features.test.js

test-message-pickup:
	npm test test/message-pickup.test.js

test-present-proof:
	npm test test/present-proof.test.js

test-report-problem:
	npm test test/report-problem.test.js

test-routing:
	npm test test/routing.test.js

test-trust-ping:
	npm test test/trust-ping.test.js

test-oob:
	npm test test/out-of-band.test.js