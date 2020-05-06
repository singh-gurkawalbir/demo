import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Fragment } from 'react';
import DynaFormGenerator from './DynaFormGenerator';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    borderStyle: 'solid',
    borderWidth: '1px 0',
    // backgroundColor: theme.palette.background.paper2,
    borderColor: 'rgb(0,0,0,0.1)',
    // minHeight: '30vh',
    maxHeight: `100%`,
    overflowY: 'auto',
    padding: theme.spacing(1),
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  expansionPanel: {
    width: '100%',
    overflow: 'hidden',
  },
}));
const DynaForm = props => {
  const {
    className,
    children,
    showValidationBeforeTouched,
    fieldMeta,
    full,
    formKey,
    ...rest
  } = props;
  const classes = useStyles();
  const { layout, fieldMap } = fieldMeta;
  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);

  if (!layout || !formKey) return null;

  return (
    <Fragment>
      <div className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKey}
        />
      </div>
    </Fragment>
  );
};

export default DynaForm;
