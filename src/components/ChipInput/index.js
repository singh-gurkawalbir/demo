import { Chip, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useState } from 'react';
import EditIcon from '../icons/EditIcon';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: '0px 8px',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginTop: '-1px',
  },
}));

export default function ChipInput(props) {
  const classes = useStyles();
  const { onChange, value } = props;
  const [tag, setTag] = useState(value);
  const [isChipView, setIsChipView] = useState(true);
  const handleBlur = e => {
    setIsChipView(true);

    if (tag === e.target.value || (!e.target.value && !tag)) {
      return;
    }

    setTag(e.target.value);
    onChange(e.target.value);
  };

  const handleTagClick = e => {
    e.preventDefault();
    setIsChipView(false);
  };

  return (
    <Fragment>
      {isChipView && (
        <Chip
          {...props}
          onClick={handleTagClick}
          label={tag || 'tag'}
          size="small"
          icon={<EditIcon />}
        />
      )}
      {!isChipView && (
        <TextField
          id="integration-tag"
          autoFocus
          defaultValue={tag}
          className={classes.textField}
          //   onChange={handleTagChange}
          onBlur={handleBlur}
        />
      )}
    </Fragment>
  );
}
