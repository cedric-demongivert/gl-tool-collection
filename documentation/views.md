# View

A view is a readonly access to a mutable collection.

# Views are immutable

A view is immutable. You can't update or reuse a view.

A view must allows it's user to access to a cursor.
This cursor may also be a view over an existing read and write cursor.
If a view is mutable, the returned cursor must update itself if its original view looks at another collection.
As a result, a cursor that is a view over another cursor must concilliate the change between it's current location, and a new one.
This operation may result in multiple possible implementation options.
For clarity sake, and in order to not handle a weak set of available cursors, views are immutable.