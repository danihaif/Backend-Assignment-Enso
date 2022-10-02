export const imagePayload = {
    name: "image1",
    repository: "repository1",
    version: "1.0.0",
    metadata: {
        "m1": "m1",
        "m2": "m2",
    }
}

export const updateImagePayload = {
    name: "image1",
    repository: "repository2",
    version: "1.0.1",
    metadata: {
        "m3": "m3",
        "m4": "m4",
    }
}

export const imagePayloadNoName = {
    repository: "repository1",
    version: "1.0.0",
    metadata: {
        "m1": "m1",
        "m2": "m2",
    }
}


export const imagePayloadNoRepository = {
    name: "image1",
    version: "1.0.0",
    metadata: {
        "m1": "m1",
        "m2": "m2",
    }
}
export const imagePayloadNoVersion = {
    name: "image1",
    repository: "repository1",
    metadata: {
        "m1": "m1",
        "m2": "m2",
    }
}
export const imagePayloadInvalidField = {
    name: "image1",
    repository: "repository1",
    version: "1.0.0",
    __metadata__: {
        "m1": "m1",
        "m2": "m2",
    }
}