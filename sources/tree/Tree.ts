export interface Tree<Data> {
    /**
     * 
     */
    readonly data: Data

    /**
     * 
     */
    readonly first: Tree<Data> | null

    /**
     * 
     */
    readonly last: Tree<Data> | null

    /**
     * 
     */
    readonly parent: Tree<Data> | null

    /**
     * 
     */
    readonly next: Tree<Data> | null

    /**
     * 
     */
    readonly previous: Tree<Data> | null
}