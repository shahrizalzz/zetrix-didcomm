import { expect } from 'chai';
import { coordinateMediation, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Coordinate Mediation module', () => {

  it('should create a mediate-request correctly', () => {
    const createMediateRequest = coordinateMediation.createMediateRequest(
      "did:example:alice",
      "did:example:bob",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createMediateRequest);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
  
    expect(unpackAuthMsg.from).that.equals("did:example:alice");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:bob");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/coordinate-mediation/3.0/mediate-request");
  });

});
