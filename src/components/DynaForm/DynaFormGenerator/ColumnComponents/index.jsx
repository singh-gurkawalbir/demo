import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import FormGenerator from '../';
import * as selectors from '../../../../reducers';

function ColumnComponent(props) {
  const { fieldMap, formKey, container, classes } = props;
  const { label: header, ...rest } = container;
  const isColumnVisible = useSelector(state =>
    selectors.isAnyFieldVisibleForMetaForm(state, formKey, {
      layout: rest,
      fieldMap,
    })
  );

  if (!isColumnVisible) return null;

  return (
    <div className={classes.child}>
      {header && <Typography>{header}</Typography>}
      <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
    </div>
  );
}

export default function ColumnComponents(props) {
  const { containers, classes } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ColumnComponent key={index} {...props} container={container} />
    ));

  return <div className={classes.container}>{transformedContainers}</div>;
}
