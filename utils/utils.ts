export const filterObjByNonEmptyKeyAndValues = (obj: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
                return key !== '' && value !== '' && value !== null && value !== undefined
            }
        ));
}

export function parseIntWithFallback<T>(value: any, def: T): number | T {
    if (typeof value === 'number') {
        return value
    }

    let parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
        parsed = parseFloat(value);
    }

    return isNaN(parsed) ? def : parsed;
}
