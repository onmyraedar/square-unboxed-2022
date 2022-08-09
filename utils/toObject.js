// This helper function is needed because
// The Express API cannot serialize BigInts

function toObject(object) {
    return JSON.parse(
        JSON.stringify(object, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ));    
}

module.exports = ("toObject", toObject);