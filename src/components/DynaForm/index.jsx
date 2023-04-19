/* eslint-disable react/state-in-constructor */
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import LogRocket from 'logrocket';
import { Box } from '@celigo/fuse-ui';
import DynaFormGenerator from './DynaFormGenerator';
import { selectors } from '../../reducers';
import useAutoScrollErrors from './useAutoScrollErrors';
import CodePanel from '../AFE/Editor/panels/Code';
import FieldMessage from './fields/FieldMessage';
import { FieldDefinitionException } from '../../utils/form';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    maxHeight: '100%',
    border: 'none',
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  Accordion: {
    width: '100%',
    overflow: 'hidden',
  },
  actions: {
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  resourceFormButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const key = 'key';

class DynaFormErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    if (error instanceof FieldDefinitionException) {
      this.setState({error});
    } else {
      this.setState({error: {message: 'Some unknown error'}});
    }
    LogRocket.captureException(error);
  }

  render() {
    if (this.state.error) {
      return (
        <>
          <div>
            <FieldMessage isValid={false} errorMessages={this.state.error?.message} />
          </div>
          {this.state.error?.fieldId &&
          (
            <CodePanel
              value={this.props.fieldMap?.[this.state.error?.fieldId]}
              mode="json"
              readOnly
              overrides={{ showGutter: false}}
            />
          )}
        </>
      );
    }

    return this.props.children;
  }
}

export default function DynaForm(props) {
  const {
    className,
    formKey,
    autoFocus,
    sxCss,
    ...rest
  } = props;
  const classes = useStyles();

  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);
  const formRef = useRef();

  useAutoScrollErrors({ formKey, formRef});
  const fieldMeta = useSelector(state => selectors.formState(state, formKey)?.fieldMeta, shallowEqual);

  const remountKey = useSelector(state => selectors.formRemountKey(state, formKey)) || key;

  if (!formKey || !fieldMeta) return null;
  const {layout, fieldMap} = fieldMeta;

  if (!fieldMap) return null;

  return (
    <Box ref={formRef} className={clsx(classes.fieldContainer, className)} sx={[...(Array.isArray(sxCss) ? sxCss : [sxCss])]}>
      <DynaFormErrorBoundary fieldMap={fieldMap} key={remountKey}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKey}
          key={remountKey}
        />
      </DynaFormErrorBoundary>
    </Box>
  );
}

