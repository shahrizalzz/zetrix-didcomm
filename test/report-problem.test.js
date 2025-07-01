import { expect } from 'chai';
import { reportProblem, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Report Problem module', () => {

  it('should create a problem-report correctly', () => {
    const createMediateRequest = reportProblem.createProblemReport(
      "abcd1234",
      "e.m.msg",
      "Error unpacking message.",
    );    
  
    const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:alice#key-2", "did:example:bob#key-2", createMediateRequest);

    const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");
  
    expect(unpackAuthMsg.body.code).that.equals("e.m.msg");
    expect(unpackAuthMsg.body.comment).that.equals("Error unpacking message.");
    expect(unpackAuthMsg.type).that.equals("https://didcomm.org/report-problem/2.0/problem-report");
  });

});
