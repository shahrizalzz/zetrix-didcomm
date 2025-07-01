import { expect } from 'chai';
import { discoverFeatures, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Discover Feature module', () => {

  it('should create a queries correctly', () => {
    const createQueries = discoverFeatures.createQueries(
      "did:example:alice",
      "did:example:bob",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createQueries);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
  
    expect(unpackAuthMsg.from).that.equals("did:example:alice");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:bob");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/discover-features/2.0/queries");
  });

  it('should create a disclose correctly', () => {
    const disclosures = [
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/discover-features/2.0"
      },
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/trust-ping/2.0"
      },
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/basicmessage/2.0"
      },
    ];

    const createQueries = discoverFeatures.createDisclose(
      "did:example:bob",
      "did:example:alice",
      "abc123456",
      disclosures
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH", "did:example:bob#key-2", "did:example:alice#key-2", createQueries);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf");
  
    expect(unpackAuthMsg.from).that.equals("did:example:bob");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:alice");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/discover-features/2.0/disclose");
  });

  it('should create a disclose correctly', () => {
    const disclosures = [
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/discover-features/2.0"
      },
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/trust-ping/2.0"
      },
      {
        "feature-type": "protocol",
        id: "https://didcomm.org/basicmessage/2.0"
      },
    ];

    const createQueries = discoverFeatures.createDisclose(
      "did:example:bob",
      "did:example:alice",
      "abc123456",
      disclosures
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH", "did:example:bob#key-2", "did:example:alice#key-2", createQueries);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf");
  
    expect(unpackAuthMsg.from).that.equals("did:example:bob");
    expect(unpackAuthMsg.to[0]).that.equals("did:example:alice");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/discover-features/2.0/disclose");
  });

});
