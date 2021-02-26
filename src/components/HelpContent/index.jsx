import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '12px',
    minWidth: '319px',
    maxWidth: '319px',
    borderRadius: '4px',
    textAlign: 'left',
    overflow: 'hidden',
  },
  title: {
    color: theme.palette.text.title,
  },
  content: {
    paddingTop: '10px',
    paddingBottom: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
    fontFamily: 'Roboto400',
    color: theme.palette.text.primary,
    fontSize: '14px',
    lineHeight: '22px',
    whiteSpace: 'normal',
    '& > div > pre': {
      background: theme.palette.background.paper2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      overflowX: 'auto',
    },
  },
  action: {
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    float: 'left',
    width: '60%',
    paddingTop: 10,
  },
  caption: {
    wordBreak: 'break-word',
  },
  actionButtons: {
    float: 'right',
    textAlign: 'right',
    paddingTop: '8px',
    '& Button': {
      borderColor: theme.palette.divider,
      padding: '3px 5px',
      background: 'none',
      float: 'left',
      minWidth: '30px',
      marginRight: '5px',
      textTransform: 'capitalize',
      borderRadius: '2px',
      lineHeight: 'normal',
      fontSize: '12px',
      letterSpacing: '0px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
  feedbackTextField: {
    margin: theme.spacing(1, 0),
    width: '100%',
    '& > div': {
      padding: 0,
      '& > textarea': {
        padding: 12,
      },
    },
  },
}));

export default function HelpContent({ children, title, caption, fieldId, resourceType }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [feedbackText, setFeedbackText] = useState(false);
  const [feedbackTextValue, setFeedbackTextValue] = useState('');
  const handleUpdateFeedBack = useCallback(
    helpful => () => {
      if (helpful) {
        dispatch(actions.postFeedback(resourceType, fieldId, helpful));
      } else {
        setFeedbackText(true);
      }
    },

    [dispatch, fieldId, resourceType]
  );
  const handleSendFeedbackText = useCallback(() => {
    dispatch(
      actions.postFeedback(resourceType, fieldId, false, feedbackTextValue)
    );
  }, [dispatch, feedbackTextValue, fieldId, resourceType]);
  const onChange = useCallback(e => {
    setFeedbackTextValue(e.target.value);
  }, []);

  return (
    <div data-public className={classes.wrapper}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      {caption && (
        <Typography variant="caption" className={classes.caption}>
          {caption}
        </Typography>
      )}
      {feedbackText ? (
        <>
          {/* TODO:Azhar some styling required */}
          <TextField
            name="feedbackText"
            placeholder="Please let us know how we can improve the text area."
            multiline
            onChange={onChange}
            variant="outlined"
            className={classes.feedbackTextField}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSendFeedbackText}>
            Submit
          </Button>
        </>
      ) : (
        <>
          <div className={classes.content}>{children}</div>
          <div className={classes.action}>
            <Typography className={classes.actionTitle}>
              Was this helpful?
            </Typography>
            <div className={classes.actionButtons}>
              <Button
                data-test="yesContentHelpful"
                variant="outlined"
                onClick={handleUpdateFeedBack(true)}
                color="secondary">
                Yes
              </Button>
              <Button
                data-test="noContentHelpful"
                variant="outlined"
                color="secondary"
                onClick={handleUpdateFeedBack(false)}>
                No
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
