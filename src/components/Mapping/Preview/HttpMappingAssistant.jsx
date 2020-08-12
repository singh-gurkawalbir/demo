import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import CodePanel from '../../AFE/GenericEditor/CodePanel';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  editor: {
    width: '100%',
    height: '100%',
    '& > div': {
      background: theme.palette.background.paper2,
    },
  },
}));

export default function HttpMappingAssistant(props) {
  const { editorId, data: dataInput, rule } = props;
  const [initTriggered, setInitTriggered] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, result } = useSelector(state =>
    selectors.editor(state, editorId)
  );

  useEffect(() => {
    if (!initTriggered && dataInput && rule) {
      dispatch(
        actions.editor.init(editorId, 'handlebars', {
          strict: false,
          autoEvaluate: true,
          template: rule,
          data: dataInput,
        })
      );
    }
    setInitTriggered(true);
  }, [
    data,
    dataInput,
    dispatch,
    editorId,
    initTriggered,
    props.data,
    props.rule,
    props.strict,
    rule,
  ]);

  useEffect(() => {
    if (data && dataInput && data !== dataInput) {
      dispatch(actions.editor.patch(editorId, { data: dataInput }));
    }
  });

  return (
    <>
      <div className={classes.header}>
        <Typography variant="h4">Preview</Typography>
      </div>
      <div className={classes.editor}>
        <CodePanel
          height="100%"
          width="100%"
          name="result"
          value={result ? result.data : ''}
          mode="text"
          readOnly
        />
      </div>
    </>
  );
}
