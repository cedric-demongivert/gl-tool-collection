/**
 * A unique value that symbolizes a given assertion
 */
export type Mark = symbol

/**
 *
 */
export namespace Mark {
    /**
     * A value that store a Mark.
     */
    export type Container = {
        mark(): Mark
    }

    /**
     * A value convertible to a Mark.
     */
    export type Alike = Container | Mark

    /**
     * Converts a mark-like object into a Mark.
     *
     * @param markLike - A mark-like object to convert.
     *
     * @return The mark associated with the given mark-like object.
     */
    export function resolve(markLike: Alike): Mark {
        return typeof markLike === 'symbol' ? markLike : markLike.mark()
    }
}