import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';

export function createField(path, purpose, filter) {
  return {
    path,
    purpose,
    filter
  };
}

export function createSchema(uri, required) {
  const schema = {
    uri
  };

  if (required != null) {
    schema.required = required;
  }

  return schema;
}

export function createInputDescriptor(id, name, purpose, group, schema, limitDisclosure, fields) {
  const descriptor = {
    id,
    schema,
    constraints: {
      fields
    }
  };

  if (group != null) {
    descriptor.group = [group];
  }

  if (name != null) {
    descriptor.name = name;
  }

  if (purpose != null) {
    descriptor.purpose = purpose;
  }

  if (limitDisclosure != null) {
    descriptor.constraints.limit_disclosure = limitDisclosure;
  }

  return descriptor;
}

export function createSubmissionRequirement(name, purpose, rule, count, from) {
  const requirement = {
    name,
    purpose,
    rule,
    from
  };

  if (count != null) {
    requirement.count = count;
  }

  return requirement;
}

export function createFrame(context, type, credentialTypes) {
  const frame = {
    "@context": context,
    "type": type,
    "credentialSubject": {}
  };

  credentialTypes.forEach(cred => {
    frame.credentialSubject[cred.name] = {};

    cred.fields.forEach(field => {
      if (field.range) {
        frame.credentialSubject[cred.name][field.name] = {
          "@value": { [`@${field.range.operator}`]: field.range.value }
        };
      } else {
        frame.credentialSubject[cred.name][field.name] = {};
      }
    });
  });

  return frame;
}

export function createFormat(type, proofType, alg) {
  if (proofType) {
    return {
      [type]: {
        proof_type: proofType
      }
    };
  } else if (alg) {
    return {
      [type]: {
        alg: alg
      }
    };
  }
  return null;
}

export function createPresentationDefinition(id, inputDescriptors, submissionRequirements, name, purpose, format) {
  const definition = {
    id: id,
    input_descriptors: inputDescriptors,
  };

  if (submissionRequirements) {
    definition.submission_requirements = submissionRequirements;
  }
  if (name) {
    definition.name = name;
  }
  if (purpose) {
    definition.purpose = purpose;
  }
  if (format) {
    definition.format = format;
  }

  return definition;
}

export function createRequestPresentation(from, to, thid, goalCode, comment, isWillConfirm, presentationDefinition) {
  const message = {
    id: createUUID(),
    thid: thid,
    typ: "application/didcomm-plain+json",
    type: "https://didcomm.org/present-proof/3.0/request-presentation",
    from: from,
    to: [to],
    created_time: getCurrentTimestampMillis(),
    body: {
      goal_code: goalCode,
      comment: comment,
      will_confirm: isWillConfirm ? true : false,
    },
    attachments: [
      {
        id: createUUID(),
        media_type: "application/json",
        format: "dif/presentation-exchange/definitions@v1.0",
        data: {
          json: {
            presentation_definition: presentationDefinition
          }
        }
      }
    ]
  }

  return JSON.stringify(message);
}

export function createProposePresentation(from, to, pthid, goalCode, comment, presentationDefinition) {
  const message = {
    id: createUUID(),
    pthid: pthid,
    typ: "application/didcomm-plain+json",
    type: "https://didcomm.org/present-proof/3.0/propose-presentation",
    from: from,
    to: [to],
    created_time: getCurrentTimestampMillis(),
    body: {
      goal_code: goalCode,
      comment: comment,
    },
    attachments: presentationDefinition ? [
      {
        id: createUUID(),
        media_type: "application/json",
        data: {
          json: {
            presentation_definition: presentationDefinition
          }
        }
      }
    ] : [],
  };

  return JSON.stringify(message);
}

export function createVpSubmission(vp, id, definitionId, descriptorId, format, path) {
  const presentationSubmission = {
    id: id,
    definition_id: definitionId,
    descriptor_map: [
      {
        id: descriptorId,
        format: format,
        path: path
      }
    ]
  };

  vp.presentation_submission = presentationSubmission;

  let typeArray = Array.isArray(vp.type) ? [...vp.type] : [vp.type];
  typeArray = typeArray.filter(t => t !== "PresentationSubmission");
  typeArray.push("PresentationSubmission");
  vp.type = typeArray

  return vp;
}

export function createPresentation(from, to, thid, vpSubmission) {
  // Define the message object with the required fields
  const message = {
    id: createUUID(),
    typ: "application/didcomm-plain+json",
    type: "https://didcomm.org/present-proof/3.0/presentation",
    from: from,
    to: [to],
    thid: thid,
    created_time: getCurrentTimestampMillis(),
    body: {},
    attachments: [
      {
        id: createUUID(),
        media_type: "application/json",
        data: {
          json: vpSubmission
        }
      }
    ]
  };

  return JSON.stringify(message);
}

export function createAck(from, to, pthid, status) {
  // Define the message object with the required fields
  const message = {
    id: createUUID(),
    typ: "application/didcomm-plain+json",
    type: "https://didcomm.org/present-proof/3.0/ack",
    from: from,
    to: [to],
    pthid: pthid,
    created_time: getCurrentTimestampMillis(),
    body: {
      status: status, //OK or PENDING
    }

  };

  return JSON.stringify(message);
}