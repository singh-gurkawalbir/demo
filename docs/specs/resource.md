### Client abstraction to integrator.io resource management.

## Summary
The new UI codebase offers a client API for managing CRUD operations against all resources accessible via the integrator.io "model plural" API endpoints. This set of endpoints allows for a uniform interface against most resource types, but has limitations like poor patch support, and no page, sort, and filter modifiers.
The client API abstracts direct access to the API and overcomes these issues by providing in-client implementations of missing features. This extended interface is available to all UI components. Furthermore, this interface has extensive tests that test the client contracts and as such should be able to be replaced by a more fully featured API when our product road map allows.

## &lt;LoadResource&gt; wrapper
Any time a UI component needs to access any resource or resource list of a given type, their component tree should be wrapped with a custom &lt;LoadResources&gt; component. This component has a "resources" property which is used to designate one or more resource types that the data layer should load before any child components get rendered. 

Note that the &lt;LoadResources&gt; component does not have any DOM signature. It simply manages the async process of fetching resources. There is an optional "required" parameter which tells the component whether or not its children depend on all resources absolutely, and thus not render any children until all API activity is completed. Some components (like search results) are smart enough to handle intermittent states where some resources are loaded while others are not and these do not "require" any or all API activity to complete.

Example:
```js static
<LoadResources resources="exports, imports, connections" required={false}>
  <SearchResults /> 
</LoadResources>
```

Note that the data-layer is smart enough to only load any resource collections which are not yet cached. This does however create a possible problem of stale cache in an org account with multiple active users or single user account with multiple session (>1 tabs/browsers).

Our current plan is to add periodic cache refresh logic to the data layer. The details of the cache update schedule has not yet been determined.  It will probably be some combination of idle time and user activity with a fall off to refresh time if the UI is not being used (no input events are triggered).

## Patch API Overview
Our data-layer differentiates between cached resource data and any pending user changes to these resources by storing patch request separately from their cached targets. This allows us for example to refresh the cache without wiping out a users change requests. When our UI "asks" the client data-layer for a resource by id, we return a union of the cached resource + any pending patches to that resource. This keeps all complexity (and tests) in the data-layer and offers clean, simple and thus maintainable component logic. The result of reducing complexity in the components, and having a fully tested client data-layer is to reduce occurrences of bugs as new features roll.

The client API uses a patch/undo/commit pattern for making committing and reverting changes against resources. Any client patch operation is held in a "session" part of app state, while the resources are in an immutable "data" state. Furthermore any patch operation can optionally be tagged with a key such that future commit requests can scope their changes by referencing this same key. Note that prior to any commit, all patches are "undoable" until the last patch is removed. Given undo operations also can specify scope, it is possible to track independent feature user trajectories. For example we could allow for simultaneously editing fields in a form and then when an AFE is launched, scope changes within separately, providing its own undo history and independent (if desired) commit.

Note that all patch/undo/commit operations are always at the individual resource level. Every operation requires a resourceId. It's possible to track any number of patch-sets against any number of resources. API business rules are applied when "commit" operations are requested, not on patches. Only if desired, are client validation rules added (field-level form validation of numbers, urls, etc).

## Virtual Resources
As mentioned above, all patch operations require a resourceId. There is no restriction on what this ID is... by circumstance, if the id exists (is a reference to an existing resource), then any subsequent request to the data-layer for a resource will return the resource with the applied patch. In reality, the data-layer returns a more complex object, but for the most part UI components don’t care about the details, and typically use the merged result.

Example:
```js static
// request for resource 
// resourceType = model plural name (exports, imports, etc) 
// scope = optional, if omitted all patches are applied to merge result. 
const resource = selectors.resourceData(resourceType, id, scope); 
// returns: { merged, patch, master, lastChange }
```

If a resource Id is used that does not exist, very little changes until a commit operation. Our data-layer does not care that the id does not point to an existing resource. Instead it applies any patches against an empty object. The UI uses a convention of prefixing "new-" to a "shortId()" function for generating new resourceIds. This allows us to also provide an interface to UI components for quickly identifying if they are dealing with a virtual resource. In practice most components don't care, but as an example, a form submit button component would want to know this so it could change its text to "Create" instead of "Update".

Another noteworthy implication is that it is possible to build a complex map of virtual resources, and the UI will function just fine. A virtual flow for example could contain any combination of existing and virtual imports/exports and connections, in any combination at any reference depth. Since our "preview" and "processor" endpoints have virtual counterparts, we can fetch sample and app metadata just fine.

## Commits
When the data layer receives a request to commit a patch-set (optionally by scope), the logic changes depending on wether or not a resource exists with the provided id.

### Existing Resources
For commits against existing resources, the data-layer will force-fetch the resource to make sure it matches the cached version. Our data-layer borrows more terms from git and calls the cached browser version "master" and the calls the original returned by our API "origin". We use the lastModifiedDate field (common on all resources) as a version identifier and if there is a difference, we diff the 2 models. If there are any noteworthy changes that conflict with the pending patches, we record these as "conflicts" (in the data-layer) and postpone the commit operation. We also replace the master cached copy with the fetched origin, forcing the UI to re-render the user's current patch-set against the updated resource. It's up to the UI what to do next. Currently we throw up a dialog which informs the user of the changes made by some other session and allows them to continue or cancel to review the merged changes.

### New Resources
The above conflict resolution steps are not applicable for new resources. There is however another complexity. Our data-layer (and possibly url) contain references to virtual resources. Upon successful POST to create new resources, they data-layer needs to scan all its cache and replace references to the virtual resources with the id returned from the POST API call. The data-layer also makes available an id map (virtual id->real id) available so that the UI components can react to successful new resource commits as needed. In most cases this just means replacing the url with the correct path signature and a success confirmation to the user.

