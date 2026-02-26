/**
 * Returns Hijri date string using the browser's built-in Intl API.
 */
export function getHijriDate(date = new Date()) {
    try {
        return date.toLocaleDateString('en-US-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    } catch {
        return ''
    }
}

/**
 * Returns e.g. "Friday, 28 February 2026"
 */
export function getGregorianDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
