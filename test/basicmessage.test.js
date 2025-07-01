import { expect } from 'chai';
import { basicMessage, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Basic Message module', () => {

  it('should create a basicmessage correctly', () => {
    const createBasicMessage = basicMessage.createBasicMessage(
      "did:example:alice",
      "did:example:bob",
      "Hi Bob! How are you?",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createBasicMessage);
    
    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
  
    expect(unpackAuthMsg.from).that.equals("did:example:alice");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:bob");
    expect(unpackAuthMsg.body.content).that.equals("Hi Bob! How are you?");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/basicmessage/2.0/message");
  });

});
