import { expect } from 'chai';
import { presentProof, packMessage, unpackMessage } from 'zetrix-didcomm';
describe('Present Proof module', () => {

    it('should create a request-presentation correctly', () => {

        //1a. Create field for input descriptors
        const field1 = presentProof.createField(
            ["$.credentialSubject.drivingLicense.idNo"],
            "The driving license ID number must be provided.",
            null
        );

        const field2 = presentProof.createField(
            ["$.credentialSubject.drivingLicense.age"],
            "Prove that the individual is above 18 without disclosing the exact age.",
            { type: "number", minimum: 18 }
        );

        //1b. Create schema for input descriptors
        const schema1 = presentProof.createSchema("https://www.w3.org/2018/credentials/v1", null);
        const schema2 = presentProof.createSchema("https://example.com/schemas/drivingLicense.json", true);

        //2a. Create input descriptors for presentation definition
        const descriptor = presentProof.createInputDescriptor(
            "driving-license-credential", // id
            null, // name is optional
            null, // purpose is optional
            "A", // put null if you don't have submission requirement
            [schema1, schema2], // schema
            "required", // limit_disclosure
            [field1, field2] // fields in constraints
        );

        // OPTIONAL
        //2b. Create submission requirements for presentation definition
        const submissionRequirements = presentProof.createSubmissionRequirement(
            "driving-license-submission-requirement",
            "The driving license must be provided.",
            "all",
            null,
            "A"
        );

        //2c. Create format for presentation definition
        const format = presentProof.createFormat("ldp_vp", ["Ed25519Signature2020", "BbsBlsSignatureProof2020"], null);
        
        /* Example if format in jwt_vp
        const format = presentProof. createFormat("jwt_vp", null, ["ES256"]);
        */

        //3. Create presentation definition for request presentation
        const definition = presentProof.createPresentationDefinition(
            "driving-license-presentation-definition",
            descriptor,
            submissionRequirements,
            "Driving License Presentation Definition",
            "This presentation definition is used to verify the driving license.",
            format
        );

        //4. Create request presentation message
        const request = presentProof.createRequestPresentation(
            "did:example:verifier",
            "did:example:prover",
            "abc123456",
            "verify_identity",
            "Requesting a presentation for verification.",
            true,
            definition
        );      

        //5. Pack the request presentation message to JWE (JSON Web Encryption)
        const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:verifier#key-2", "did:example:prover#key-2", request);

        //6. Unpack the request presentation message to JWM (JSON Web Message)
        const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");

        expect(unpackAuthMsg.from).that.equals("did:example:verifier");
        expect(unpackAuthMsg.to[0]).that.equals("did:example:prover");
        expect(unpackAuthMsg.type).that.equals("https://didcomm.org/present-proof/3.0/request-presentation");
    });

    it('should create a propose-presentation correctly', () => {

        //1. Create propose presentation
        const propose = presentProof.createProposePresentation(
            "did:example:prover",
            "did:example:verifier",
            "abc123456",
            "verify_identity",
            "Proposing a presentation for verification.",
            null
        );

        //2. Pack the propose presentation message to JWE (JSON Web Encryption)
        const packAuthMsg = packMessage.packAuthCrypt("privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH", "did:example:prover#key-2", "did:example:verifier#key-2", propose);

        //3. Unpack the request presentation message to JWM (JSON Web Message)
        const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf");

        expect(unpackAuthMsg.from).that.equals("did:example:prover");
        expect(unpackAuthMsg.to[0]).that.equals("did:example:verifier");
        expect(unpackAuthMsg.type).that.equals("https://didcomm.org/present-proof/3.0/propose-presentation");
    });

    it('should create a presentation correctly', () => {
        //1. Create a verifiable presentation
        const vp = {
            "type": [
                "VerifiablePresentation"
            ],
            "holder": "did:zid:2c8c214c958e0f28e8e3aac60a38abd161e3135efa33bb1c4233e0c6a4518a17",
            "verifiableCredential": [
                {
                    "id": "did:zid:256540477b20abfe897f96f156825c4e51712f063dba43046521f3400bfadfd2",
                    "type": [
                        "VerifiableCredential",
                        "DrivingLicense",
                        "DegreeCertificate"
                    ],
                    "issuer": "did:zid:0d48916e8b0f10297b023b680fb7ab2367d5eb03a1a6bb876d63d1a9f5677dcb",
                    "issuanceDate": "2025-01-01T00:00:00Z",
                    "expirationDate": "2026-01-01T00:00:00Z",
                    "credentialSubject": {
                        "id": "did:zid:2c8c214c958e0f28e8e3aac60a38abd161e3135efa33bb1c4233e0c6a4518a17",
                        "drivingLicense": {
                            "name": "Ali bin Abu",
                            "gender": "Male"
                        },
                        "degreeCertificate": {
                            "course": "Science Computer"
                        }
                    },
                    "proof": [
                        {
                            "type": "BbsBlsSignatureProof2020",
                            "created": "2025-02-27T02:17:04.433651500Z",
                            "proofPurpose": "assertionMethod",
                            "proofValue": "uAAkAU5YoYWeOvPnjQRadKr60okQkRxxGT93eNskuFQIiTlvT_2lUr089c-j-ErnqA6lhTKHrR3Lk2gRRXadUv1z7iZ9RJQNQl-wWHnuWpBcNWQ2p6nFMAmIO_b28XTfVmxe_DbheIH1UwQSxa6woXvR24_p3lfmyX36L8KYEN3dQkTHAVYMCEpwn4Tb5LvJWSAG6HAAAAHSXKlfyVErxKc-0OpeK1EuqyiT_FPhvjT56xMWaLIwlG6kHPWnfRsNbvXVl0Rhe5oYAAAACFrrOE3n5U8ArekXpPDBpOLDt3Ui_tiw-IPuhqnEqXk9ByxW-dIFmZk2Plk2AUQxsMhS-bW_f_qG_P9tXXlKRbKT1vxm4m-vWM-eLp0bcnJ-7B3OcXCuFoKElIMu3VXP9n04SuGp3YH8qBOSiMXtdYAAAAAdg4ItGBpzQnPDa2HoGZ9LloNqU_uTnbP4t19YawgHvc1jRniNyQPoI-mKRSCxsFAjzP-j_wP-S1tDFin-CIRO0Hw5jhFvs61rijV8rbCn32eklRPzOiWYaClVOJsF15NxXFnyKnEEdqfFo-W9gmFM9cp4hQyDu7XCFgWa_PtIiamljAS2HgdY7SfL7xeb32RUaPFM10ci7l8j01IpOKE-_XlS-nHrGOokRYO5SSg5eATG3mXyf4HgHT8BOQSLQAzJLh4BPxxwr34oSpCVaD13K0oyXFezipfCIx9LS44cd9A",
                            "verificationMethod": "did:zid:0d48916e8b0f10297b023b680fb7ab2367d5eb03a1a6bb876d63d1a9f5677dcb#delegate-1",
                            "nonce": "u9quKUbqqIw3y5HqMyQGNQx1gassOpUDc_h7eTXtSzqU"
                        }
                    ],
                    "@context": [
                        "https://www.w3.org/2018/credentials/v1",
                        "https://w3id.org/security/bbs/v1",
                        "https://test-node.zetrix.com/getAccountMetaData?address=ZTX3bBu7mDTVXCFYWPofHubHhRNy1RQFbLPoP&key=template__did:zid:87bc1ea5269f877999db04b5e210b5692f731e3dd8a02aaeb0ca4fe019af070c",
                        "https://test-node.zetrix.com/getAccountMetaData?address=ZTX3bBu7mDTVXCFYWPofHubHhRNy1RQFbLPoP&key=template__did:zid:5c3a6556287c87cd8c12dd26c83af8a1a9db61b21dfc66a92738a80ee8476956"
                    ]
                }
            ],
            "proof": {
                "type": "Ed25519Signature2020",
                "created": "2025-02-27T02:17:22.606197800Z",
                "proofPurpose": "assertionMethod",
                "verificationMethod": "did:zid:2c8c214c958e0f28e8e3aac60a38abd161e3135efa33bb1c4233e0c6a4518a17#controllerKey",
                "jws": "eyJhbGciOiJFZERTQSJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvc2VjdXJpdHkvYmJzL3YxIl0sImhvbGRlciI6ImRpZDp6aWQ6MmM4YzIxNGM5NThlMGYyOGU4ZTNhYWM2MGEzOGFiZDE2MWUzMTM1ZWZhMzNiYjFjNDIzM2UwYzZhNDUxOGExNyIsInJhbmdlUHJvb2YiOnsiYml0cyI6MzIsImNvbW1pdG1lbnRzIjpbInVRdGwxVU5lQXNSUkRSSURETjh5dmpaRlpWMXhhdzIxUkFqdTh2WHBtakNzIiwidTlGYU9MT3hsMWJPSFJvY09fYktEbG9LamNsVzR6aUdUcDdabVFlUUpqRVEiLCJ1RWxiNjZlbU1GRU1ZOG1OZ3BiVG9wNG9QNGJiaHZVM2RIakIwSno2M2tRayIsInVBajFIQXk2Z000MEVYazBUclJmUEROeEdJTDZmT2RsMXU2RkRoUnB4MWpBIl0sImRvbWFpbiI6ImFnZS1yYW5nZS1wcm9vZiIsInByb29mVmFsdWUiOiJ1QkVMWmRWRFhnTEVVUTBTQXd6Zk1yNDJSV1ZkY1dzTnRVUUk3dkwxNlpvd3I5RmFPTE94bDFiT0hSb2NPX2JLRGxvS2pjbFc0emlHVHA3Wm1RZVFKakVRU1Z2cnA2WXdVUXhqeVkyQ2x0T2luaWdfaHR1RzlUZDBlTUhRblByZVJDUUk5UndNdW9ET05CRjVORTYwWHp3emNSaUMtbnpuWmRidWhRNFVhY2RZd01Db1Ytd2lRalJvbENReVVrSHY4ZjhPVGxaSy1CUlVfMm5ydkVqLWg4eFZTYllPTldTNmhMUVQ1SzhnQTl1ckhSUHdIMGdCeUxDQWc0dzRmUFJ0dlRzaDE0RjYtd3BKbm5DRk5PSFo4Yk1BQ1F6Xy1FQ2Fsa2htTmxDZnNMS3hhQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEZ1JCdWZ1SFhpdUJJVUxrVGRaejlDOGJCa2xMVVBEaUUwV3lZbS15WFFqRV9yeXNWSVE2bXZJUlZMM09qazJCTGVGSlJjRVpVUU01VkVzT0dDZk9DVnpzLWxjcVg4QXI5eF9FMWctaEVrZTIxR1RvNlJ3TVNERkozdzduUXdwcVZFN0FrZHZsaTBLemVubGQ3NmdTd2oxVjdJRGdDdHBTRDd3TlNfQUR4emd3VVJwME1mZmt2cmJiS0ttd2ZQNk83ZjlqeVV0Wk5LZU83djJhOFU2eEg2MUZWRThYTFpIaTVqa2REdktCeWV0YXlVZU5rclVKdlY2bzB6bEhyb0FBdFBfZ1BYbTZTZEVkdHFGSk9XRzNoWjUzMk5fTEpnTGZ2WTRKaWc0VHFBOXE5X3FPbUpQREJiemVfbVM4Z0RwRm4xT01MWU9DN0RIQUxSMVYtZEM1QUpLUkxsSGlGQ2FVTFZteWlVNEV0Y1R2OEdOdTB6NzktSVJ3cVBSck9jUVBUZ1hqa21mSXRRRGJQUEV0UXhTUG1femRic0dYSzdVOXluVjhmRlZmMGdrSG51SWNUVmJRcnpOUWU4Mk5QakFPYUZWc1VGTFc3RUdKeUpJVVB4b3F4VnVLcmNKNG9iMGl1cHdEZjAxSkpVQ3pSNGxUajRidVYyS1U5blRwQ2N1UVFGTFRaSHFBdW9LZGlGQWlRQ05iOTZjVWk3cVJjZ3F4S1J5WjUwWmpiSzFVcnNpNHVkTmtYa3Y2bUE2azQtWmVpcFJ1Sk96OEJlcEl6T0ZZbzF6VnNpZ0tiZUVQWnBJWjNrSEZzLW53ZklkdEVwZHg1OTQwczBUQVFkbVktRTM2QmM2ZXlpYTBNLVFURzRyMnhLODgtV3hfYTlkeFM0dmhoZ1lDWHEwU2VqcGFyT3hXWWNlUURXd3c0bTE0dXQ1T291Ny1EaUZGTmVmTXM0QnBVTlBzM3pZSHJPWTNkeWpMWUhXSVBCZ0FFUE9FWE84aHQydkZlSV85WFdOWllBTnpTM0VTMkxsUnloZkZlTWxzMlVFV3dLTVhxdmhEbTNjeFRMWXl4Qkxrcy1POVQxUW83VTlqdlNWSmdpNXRUR2lwaW1GeHNxT2ZfY3NDOExBRDQzVGd6QnhBYnFHOGpZYkxSdDNuN0VDQW5wU0NKTTVmNE9aLU9EMmdxTGpybXFHeGhrdEd0al91S25iZy1oaTJ4Vjh5Q1E5SjhnczItbUVZdElwV19TQjhaSGg1TXpEcENXTDI2bEZTbzBUaF9IeWZ3U0QwUVZXVXJ1U1RvX2tGZ2UzdjAya0pNQWZUenBvRnhOWDBoNWVRNm9CSGd3R0JFRmxLR3RLMUlERkdxSU9DX1VFIiwicmFuZ2UiOlt7ImF0dHJpYnV0ZSI6ImRyaXZpbmdMaWNlbnNlLmFnZSIsIm1heCI6NTAsIm1pbiI6MTh9LHsiYXR0cmlidXRlIjoiZGVncmVlQ2VydGlmaWNhdGUuY2dwYSIsImRlY2ltYWwiOjIsIm1heCI6NCwibWluIjoyLjl9XSwidHlwZSI6IkJ1bGxldHByb29mUmFuZ2VQcm9vZjIwMjEifSwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sInZlcmlmaWFibGVDcmVkZW50aWFsIjpbeyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvc2VjdXJpdHkvYmJzL3YxIiwiaHR0cHM6Ly90ZXN0LW5vZGUuemV0cml4LmNvbS9nZXRBY2NvdW50TWV0YURhdGE_YWRkcmVzcz1aVFgzYkJ1N21EVFZYQ0ZZV1BvZkh1YkhoUk55MVJRRmJMUG9QJmtleT10ZW1wbGF0ZV9fZGlkOnppZDo4N2JjMWVhNTI2OWY4Nzc5OTlkYjA0YjVlMjEwYjU2OTJmNzMxZTNkZDhhMDJhYWViMGNhNGZlMDE5YWYwNzBjIiwiaHR0cHM6Ly90ZXN0LW5vZGUuemV0cml4LmNvbS9nZXRBY2NvdW50TWV0YURhdGE_YWRkcmVzcz1aVFgzYkJ1N21EVFZYQ0ZZV1BvZkh1YkhoUk55MVJRRmJMUG9QJmtleT10ZW1wbGF0ZV9fZGlkOnppZDo1YzNhNjU1NjI4N2M4N2NkOGMxMmRkMjZjODNhZjhhMWE5ZGI2MWIyMWRmYzY2YTkyNzM4YTgwZWU4NDc2OTU2Il0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZUNlcnRpZmljYXRlIjp7ImNvdXJzZSI6IlNjaWVuY2UgQ29tcHV0ZXIifSwiZHJpdmluZ0xpY2Vuc2UiOnsiZ2VuZGVyIjoiTWFsZSIsIm5hbWUiOiJBbGkgYmluIEFidSJ9LCJpZCI6ImRpZDp6aWQ6MmM4YzIxNGM5NThlMGYyOGU4ZTNhYWM2MGEzOGFiZDE2MWUzMTM1ZWZhMzNiYjFjNDIzM2UwYzZhNDUxOGExNyJ9LCJleHBpcmF0aW9uRGF0ZSI6IjIwMjYtMDEtMDFUMDA6MDA6MDBaIiwiaWQiOiJkaWQ6emlkOjI1NjU0MDQ3N2IyMGFiZmU4OTdmOTZmMTU2ODI1YzRlNTE3MTJmMDYzZGJhNDMwNDY1MjFmMzQwMGJmYWRmZDIiLCJpc3N1YW5jZURhdGUiOiIyMDI1LTAxLTAxVDAwOjAwOjAwWiIsImlzc3VlciI6ImRpZDp6aWQ6MGQ0ODkxNmU4YjBmMTAyOTdiMDIzYjY4MGZiN2FiMjM2N2Q1ZWIwM2ExYTZiYjg3NmQ2M2QxYTlmNTY3N2RjYiIsInByb29mIjpbeyJjcmVhdGVkIjoiMjAyNS0wMi0yN1QwMjoxNzowNC40MzM2NTE1MDBaIiwibm9uY2UiOiJ1OXF1S1VicXFJdzN5NUhxTXlRR05ReDFnYXNzT3BVRGNfaDdlVFh0U3pxVSIsInByb29mUHVycG9zZSI6ImFzc2VydGlvbk1ldGhvZCIsInByb29mVmFsdWUiOiJ1QUFrQVU1WW9ZV2VPdlBualFSYWRLcjYwb2tRa1J4eEdUOTNlTnNrdUZRSWlUbHZUXzJsVXIwODljLWotRXJucUE2bGhUS0hyUjNMazJnUlJYYWRVdjF6N2laOVJKUU5RbC13V0hudVdwQmNOV1EycDZuRk1BbUlPX2IyOFhUZlZteGVfRGJoZUlIMVV3UVN4YTZ3b1h2UjI0X3AzbGZteVgzNkw4S1lFTjNkUWtUSEFWWU1DRXB3bjRUYjVMdkpXU0FHNkhBQUFBSFNYS2xmeVZFcnhLYy0wT3BlSzFFdXF5aVRfRlBodmpUNTZ4TVdhTEl3bEc2a0hQV25mUnNOYnZYVmwwUmhlNW9ZQUFBQUNGcnJPRTNuNVU4QXJla1hwUERCcE9MRHQzVWlfdGl3LUlQdWhxbkVxWGs5Qnl4Vy1kSUZtWmsyUGxrMkFVUXhzTWhTLWJXX2ZfcUdfUDl0WFhsS1JiS1QxdnhtNG0tdldNLWVMcDBiY25KLTdCM09jWEN1Rm9LRWxJTXUzVlhQOW4wNFN1R3AzWUg4cUJPU2lNWHRkWUFBQUFBZGc0SXRHQnB6UW5QRGEySG9HWjlMbG9OcVVfdVRuYlA0dDE5WWF3Z0h2YzFqUm5pTnlRUG9JLW1LUlNDeHNGQWp6UC1qX3dQLVMxdERGaW4tQ0lSTzBIdzVqaEZ2czYxcmlqVjhyYkNuMzJla2xSUHpPaVdZYUNsVk9Kc0YxNU54WEZueUtuRUVkcWZGby1XOWdtRk05Y3A0aFF5RHU3WENGZ1dhX1B0SWlhbWxqQVMySGdkWTdTZkw3eGViMzJSVWFQRk0xMGNpN2w4ajAxSXBPS0UtX1hsUy1uSHJHT29rUllPNVNTZzVlQVRHM21YeWY0SGdIVDhCT1FTTFFBekpMaDRCUHh4d3IzNG9TcENWYUQxM0swb3lYRmV6aXBmQ0l4OUxTNDRjZDlBIiwidHlwZSI6IkJic0Jsc1NpZ25hdHVyZVByb29mMjAyMCIsInZlcmlmaWNhdGlvbk1ldGhvZCI6ImRpZDp6aWQ6MGQ0ODkxNmU4YjBmMTAyOTdiMDIzYjY4MGZiN2FiMjM2N2Q1ZWIwM2ExYTZiYjg3NmQ2M2QxYTlmNTY3N2RjYiNkZWxlZ2F0ZS0xIn1dLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRHJpdmluZ0xpY2Vuc2UiLCJEZWdyZWVDZXJ0aWZpY2F0ZSJdfV19.MzVCRTEwMDc3OTgyRkIwRkRCMjRENDYzNzAxNzQ4OUI4N0I0MDA4RUVGQkRFREZCRDQxMTRENDMxOEJFNDVGODA1MEMwMENDNURDNDhFOTA1RUU4NTM4RUIzNTMyRTkwNUE3MTUwMEQzQzc4MjBBQkE3MDNCNzQ2N0M5RTdCMEQ"
            },
            "rangeProof": {
                "type": "BulletproofRangeProof2021",
                "range": [
                    {
                        "attribute": "drivingLicense.age",
                        "min": 18.0,
                        "max": 50.0
                    },
                    {
                        "attribute": "degreeCertificate.cgpa",
                        "min": 2.9,
                        "max": 4.0,
                        "decimal": 2
                    }
                ],
                "proofValue": "uBELZdVDXgLEUQ0SAwzfMr42RWVdcWsNtUQI7vL16Zowr9FaOLOxl1bOHRocO_bKDloKjclW4ziGTp7ZmQeQJjEQSVvrp6YwUQxjyY2CltOinig_htuG9Td0eMHQnPreRCQI9RwMuoDONBF5NE60XzwzcRiC-nznZdbuhQ4UacdYwMCoV-wiQjRolCQyUkHv8f8OTlZK-BRU_2nrvEj-h8xVSbYONWS6hLQT5K8gA9urHRPwH0gByLCAg4w4fPRtvTsh14F6-wpJnnCFNOHZ8bMACQz_-ECalkhmNlCfsLKxaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgRBufuHXiuBIULkTdZz9C8bBklLUPDiE0WyYm-yXQjE_rysVIQ6mvIRVL3Ojk2BLeFJRcEZUQM5VEsOGCfOCVzs-lcqX8Ar9x_E1g-hEke21GTo6RwMSDFJ3w7nQwpqVE7Akdvli0Kzenld76gSwj1V7IDgCtpSD7wNS_ADxzgwURp0MffkvrbbKKmwfP6O7f9jyUtZNKeO7v2a8U6xH61FVE8XLZHi5jkdDvKByetayUeNkrUJvV6o0zlHroAAtP_gPXm6SdEdtqFJOWG3hZ532N_LJgLfvY4Jig4TqA9q9_qOmJPDBbze_mS8gDpFn1OMLYOC7DHALR1V-dC5AJKRLlHiFCaULVmyiU4EtcTv8GNu0z79-IRwqPRrOcQPTgXjkmfItQDbPPEtQxSPm_zdbsGXK7U9ynV8fFVf0gkHnuIcTVbQrzNQe82NPjAOaFVsUFLW7EGJyJIUPxoqxVuKrcJ4ob0iupwDf01JJUCzR4lTj4buV2KU9nTpCcuQQFLTZHqAuoKdiFAiQCNb96cUi7qRcgqxKRyZ50ZjbK1Ursi4udNkXkv6mA6k4-ZeipRuJOz8BepIzOFYo1zVsigKbeEPZpIZ3kHFs-nwfIdtEpdx5940s0TAQdmY-E36Bc6eyia0M-QTG4r2xK88-Wx_a9dxS4vhhgYCXq0SejparOxWYceQDWww4m14ut5Oou7-DiFFNefMs4BpUNPs3zYHrOY3dyjLYHWIPBgAEPOEXO8ht2vFeI_9XWNZYANzS3ES2LlRyhfFeMls2UEWwKMXqvhDm3cxTLYyxBLks-O9T1Qo7U9jvSVJgi5tTGipimFxsqOf_csC8LAD43TgzBxAbqG8jYbLRt3n7ECAnpSCJM5f4OZ-OD2gqLjrmqGxhktGtj_uKnbg-hi2xV8yCQ9J8gs2-mEYtIpW_SB8ZHh5MzDpCWL26lFSo0Th_HyfwSD0QVWUruSTo_kFge3v02kJMAfTzpoFxNX0h5eQ6oBHgwGBEFlKGtK1IDFGqIOC_UE",
                "bits": 32,
                "domain": "age-range-proof",
                "commitments": [
                    "uQtl1UNeAsRRDRIDDN8yvjZFZV1xaw21RAju8vXpmjCs",
                    "u9FaOLOxl1bOHRocO_bKDloKjclW4ziGTp7ZmQeQJjEQ",
                    "uElb66emMFEMY8mNgpbTop4oP4bbhvU3dHjB0Jz63kQk",
                    "uAj1HAy6gM40EXk0TrRfPDNxGIL6fOdl1u6FDhRpx1jA"
                ]
            },
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/security/bbs/v1"
            ]
        };

        //2. Create a format for descriptor_map in verifiable presentation submission
        const format = presentProof.createFormat("ldp_vp", ["Ed25519Signature2020", "BbsBlsSignatureProof2020"], null);

        //3. Create a verifiable presentation submission
        const createVpSubmission = presentProof.createVpSubmission(
            vp,
            "presentation-submission-id",
            "driving-license-presentation-definition", // presentation definition id
            "driving-license-credential", // input descriptor id for descriptor_map
            format, // format for descriptor_map
            "$.verifiableCredential[0]" // path for descriptor_map
        );   

        //4. Create a presentation message
        const createPresentation = presentProof.createPresentation(
            "did:example:prover",
            "did:example:verifier",
            "abc123456",
            createVpSubmission
        );

        //5. Pack the presentation message to JWE (JSON Web Encryption)
        const packAuthMsg = packMessage.packAuthCrypt("privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH", "did:example:prover#key-2", "did:example:verifier#key-2", createPresentation);

        //6. Unpack the presentation message to JWM (JSON Web Message)
        const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf");

        expect(unpackAuthMsg.from).that.equals("did:example:prover");
        expect(unpackAuthMsg.to[0]).that.equals("did:example:verifier");
        expect(JSON.stringify(unpackAuthMsg.attachments[0].data.json)).that.equals(JSON.stringify(createVpSubmission));
        expect(unpackAuthMsg.type).that.equals("https://didcomm.org/present-proof/3.0/presentation");
    });

    it('should create an ack correctly', () => {
        //1. Create an ack message
        const createAck = presentProof.createAck(
            "did:example:verifier",
            "did:example:prover",
            "abc123456",
            "OK"
        );

        //2. Pack the presentation message to JWE (JSON Web Encryption)
        const packAuthMsg = packMessage.packAuthCrypt("privBve6bpkpdM4jHTkNnDRbVg8DYtizNubhzaYtD37GHsvFghckrNDm", "8Vo5BCHe41B4RdaFmYubxZLKo8oj6AwRsP3rK2bv63Bf", "did:example:verifier#key-2", "did:example:prover#key-2", createAck);

        //3. Unpack the presentation message to JWM (JSON Web Message)
        const unpackAuthMsg = unpackMessage.unpackAuthCrypt(packAuthMsg, "privBtpaUECfDNku8K8RJgGptKRL24c365AbFHXEctRMDJGTntWkPmJD", "CxSNscV5tJDhqAPoGaWz4ZVwaGxKyQPbbp4fwH67iDSH");

        expect(unpackAuthMsg.from).that.equals("did:example:verifier");
        expect(unpackAuthMsg.to[0]).that.equals("did:example:prover");
        expect(unpackAuthMsg.body.status).that.equals("OK");
        expect(unpackAuthMsg.type).that.equals("https://didcomm.org/present-proof/3.0/ack");
    });

});
