/**
 * Get an object with properties in obj that have a value of undefined removed.
 * @returns "Cleaned" object.
 */
export function cleanObject (obj) {
    let cleaned = { }
    for (name of Object.getOwnPropertyNames(obj)) {
        if (obj[name] != undefined) {
            cleaned[name] = obj[name]
        }
    }
    return cleaned;
}
