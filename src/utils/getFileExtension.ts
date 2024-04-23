/**
 * A helper function which will get the extension of the input file path.
 *
 * @param filePath A path string to the file.
 * @returns file extension or undefined
 */
export function getFileExtension(filePath:string) {
    const match = filePath.match(/\.([^\.]+)$/);
    return match ? match[1] : undefined;
}