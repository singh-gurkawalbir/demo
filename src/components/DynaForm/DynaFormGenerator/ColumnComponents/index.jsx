import Typography from '@material-ui/core/Typography';
import FormGenerator from '../';

export default function ColumnComponents(props) {
  const { containers, fieldMap, classes } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.child}>
          {header && <Typography>{header}</Typography>}
          <FormGenerator layout={rest} fieldMap={fieldMap} />
        </div>
      );
    });

  return <div className={classes.container}>{transformedContainers}</div>;
}
