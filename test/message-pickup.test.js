import { expect } from 'chai';
import { messagePickup, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Message Pickup module', () => {

  it('should create a live-delivery-change correctly', () => {
    const createLiveDeliveryChange = messagePickup.createLiveDeliveryChange(
      "did:example:alice",
      "did:example:bob",
      true
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createLiveDeliveryChange);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
    
    expect(unpackAuthMsg.from).that.equals("did:example:alice");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:bob");
    expect(unpackAuthMsg.body.live_delivery).that.equals(true);
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/messagepickup/3.0/live-delivery-change");
  });

});
