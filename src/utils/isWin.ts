
/**
 * A helper function which will detect the running OS.
 *
 * @returns true if running on Windows
 */
export function isWin() {
    var isWin = /^win/.test(process.platform);
    return isWin;
} 