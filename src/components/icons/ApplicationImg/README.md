This component is used to render an <img> tag for all 
supported assistants (connectors) and generic technology connectors.

Assistant Images should use the assistant prop.
```js
<div>
  <ApplicationImg assistant="jira" />
  <ApplicationImg assistant="3dcart" />
</div>
```

Generic technology connector Images should use the type prop.
```js
<div>
  <ApplicationImg type="ftp" />
  <ApplicationImg type="http" />
  <ApplicationImg type="rest" />
  <ApplicationImg type="mysql" />
  <ApplicationImg type="postgresql" />
</div>
```
