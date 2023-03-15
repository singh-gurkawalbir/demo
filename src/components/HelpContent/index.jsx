import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../actions';
import OutlinedButton from '../Buttons/OutlinedButton';
import ThumbsUpIcon from '../icons/ThumbsUpIcon';
import IconButtonWithTooltip from '../IconButtonWithTooltip';
import ThumbsDownIcon from '../icons/ThumbsDownIcon';
import CloseIcon from '../icons/CloseIcon';
import HelpContentLinks from '../HelpContentLinks';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(1.5),
    minWidth: '319px',
    maxWidth: '319px',
    borderRadius: theme.spacing(0.5),
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    wordBreak: 'break-word',
  },
  content: {
    overflowY: 'auto',
    lineHeight: '22px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    marginRight: -theme.spacing(1.5),
    padding: theme.spacing(1, 1.5, 0, 0),
    '&>.MuiTypography-root': {
      maxHeight: 200,
      padding: 0,
      '&>ul': {
        paddingLeft: theme.spacing(2),
        margin: 0,
      },
    },
    '& > div > pre': {
      background: theme.palette.background.paper2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      overflowX: 'auto',
    },
  },
  caption: {
    wordBreak: 'break-word',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  actionButton: {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(1),
    '& .MuiIconButton-label, .MuiSvgIcon-root': {
      height: theme.spacing(2.5),
      width: theme.spacing(2.5),
    },
  },
  feedbackTextField: {
    margin: theme.spacing(1, 0),
    width: '100%',
    '& > div': {
      padding: theme.spacing(1.5),
    },
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.secondary.light,
      opacity: 1,
    },
  },
  actionWrapper: {
    display: 'flex',
    padding: theme.spacing(1, 0),
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.paper2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackActionButton: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 0,
  },
}));

const FeedBackComponent = ({ children, fieldId, resourceType, updatePosition}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [feedbackText, setFeedbackText] = useState(false);
  const [feedbackTextValue, setFeedbackTextValue] = useState('');
  const handleUpdateFeedBack = useCallback(
    helpful => () => {
      if (helpful) {
        dispatch(actions.app.postFeedback(resourceType, fieldId, helpful));
      } else {
        setFeedbackText(true);
        updatePosition && updatePosition();
      }
    },

    [dispatch, fieldId, resourceType, updatePosition]
  );
  const handleSendFeedbackText = useCallback(() => {
    dispatch(
      actions.app.postFeedback(resourceType, fieldId, false, feedbackTextValue)
    );
  }, [dispatch, feedbackTextValue, fieldId, resourceType]);
  const onChange = useCallback(e => {
    setFeedbackTextValue(e.target.value);
  }, []);

  return feedbackText ? (
    <>
      <TextField
        data-private
        name="feedbackText"
        placeholder="How can we make this information more helpful?"
        multiline
          // onClick={e => { e.stopPropagation(); }}
        onChange={onChange}
        variant="outlined"
        className={classes.feedbackTextField}
        />
      <span data-test="helpFeedbackSubmit">
        <OutlinedButton
          className={classes.feedbackActionButton}
          onClick={handleSendFeedbackText}>
          Submit
        </OutlinedButton>
      </span>
    </>
  ) : (
    <>
      <Typography variant="subtitle2" component="div" className={classes.content}>{children}</Typography>
      <div className={classes.actionWrapper}>
        <Typography variant="subtitle2">Was this helpful?</Typography>
        <IconButtonWithTooltip
          data-test="yesContentHelpful"
          tooltipProps={{title: 'Yes'}}
          buttonSize={{size: 'small'}}
          className={classes.actionButton}
          onClick={handleUpdateFeedBack(true)}
          noPadding>
          <ThumbsUpIcon />
        </IconButtonWithTooltip>
        <IconButtonWithTooltip
          data-test="noContentHelpful"
          tooltipProps={{title: 'No'}}
          buttonSize={{size: 'small'}}
          className={classes.actionButton}
          onClick={handleUpdateFeedBack(false)}
          noPadding>
          <ThumbsDownIcon data-test="thumbsdownicon" />
        </IconButtonWithTooltip>
      </div>
    </>
  );
};

export default function HelpContent({ title, caption, children, supportFeedback = true, onClose = () => {}, contentId, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.titleWrapper}>
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
        <IconButton
          size="small"
          data-test="close"
          aria-label="Close"
          // onClick={e => { e.stopPropagation(); }}
          onClick={onClose}
          className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>
      {supportFeedback ? (
        <FeedBackComponent
          {...rest}
        >
          {children}
        </FeedBackComponent>
      )
        : <Typography variant="subtitle2" component="div" className={classes.content}>{children}</Typography>}
      {caption && (
      <Typography variant="subtitle2" className={classes.caption}>
        Field path: {caption}
      </Typography>
      )}
      {contentId && (
        <HelpContentLinks contentId={contentId} />
      )}
    </div>
  );
}
