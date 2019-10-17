```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
<Grid container justify="flex-start" spacing={2}>
  <Grid item>
    <HelpContent title="Small content">
      <Typography variant="body2">Some content here</Typography>
    </HelpContent>
  </Grid>
  <Grid item>
    <HelpContent title="Medium content">
      <Typography variant="body2">These are used to massage and optimize source records before they are passed along to down stream processors.</Typography>
    </HelpContent>
  </Grid>
  <Grid item>
    <HelpContent title="Large content">
      <Typography variant="body2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</Typography>
    </HelpContent>
  </Grid>
  <Grid item>
    <HelpContent caption="json.path.to.field" title="Field Help for Devs">
      <Typography variant="body2">These are used to massage and optimize source records before they are passed along to down stream processors.</Typography>
    </HelpContent>
  </Grid>
</Grid>
```