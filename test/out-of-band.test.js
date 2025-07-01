import { expect } from 'chai';
import { outOfBand } from 'zetrix-didcomm';
describe('Out of Band module', () => {

  it('should create an invitation correctly', () => {
    const createInvitation = outOfBand.createInvitation(
      "did:example:verifier",
      "streamlined-vp",
      "Streamlined Verifiable Presentation",
      ["didcomm/v2"],
      []
    );

    console.log(createInvitation);

    const createUrl = outOfBand.createUrl(
      "https://example.com/test",
      createInvitation
    );

    const encoded = createUrl.split('?_oob=')[1];

    const decoded = outOfBand.decodeInvitation(encoded);

    expect(JSON.stringify(decoded)).that.equals(createInvitation);
    expect(JSON.parse(createInvitation).from).that.equals("did:example:verifier");
    expect(JSON.parse(createInvitation).type).that.equals("https://didcomm.org/out-of-band/2.0/invitation");
  });

});
