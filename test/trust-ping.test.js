import { expect } from 'chai';
import { trustPing, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Trust Ping module', () => {

  it('should create a ping correctly', () => {
    const createPing = trustPing.createPing(
      "did:example:alice",
      "did:example:bob",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createPing);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
  
    expect(unpackAuthMsg.from).that.equals("did:example:alice");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:bob");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/trust-ping/2.0/ping");
  });

  it('should create a ping-response correctly', () => {
    const createPingResponse = trustPing.createPingResponse(
      "did:example:bob",
      "did:example:alice",
      "abc123456",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH", "did:example:bob#key-2", "did:example:alice#key-2", createPingResponse);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf");
  
    expect(unpackAuthMsg.from).that.equals("did:example:bob");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:alice");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/trust-ping/2.0/ping-response");
  });

});
