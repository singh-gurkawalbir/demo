import { fade, useTheme, makeStyles } from '@material-ui/core';

export const ReactSelectUseStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  optionRoot: {
    display: 'flex',
  },
  optionImg: {
    width: '120px',
    display: 'flex',
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    color: theme.palette.secondary.lightest,
    height: '100%',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '100%',
    width: '100%',
  },
  optionLabelMultiSelect: {
    width: '100%',
  },
  inputLabel: {
    transform: 'unset',
    position: 'static',
  },
  img: {
    maxWidth: '80px',
  },
  selectedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: '100%',
  },
  wrapper: {
    minHeight: 38,
    height: 'auto',
    '& >.MuiSelect-selectMenu': {
      height: 'auto',
    },
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  multiSelectWrapper: {
    width: '100%',
  },
  optionCheckBox: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    height: '100%',
  },
}));

export function CustomReactSelectStyles() {
  const theme = useTheme();

  return {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.palette.background.paper2
          : theme.palette.background.paper,
      border: 'none',
      minHeight: 38,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: provided => ({
      ...provided,
      borderColor: theme.palette.secondary.lightest,
      boxShadow: 'none',
      borderRadius: 2,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    }),
    menu: provided => ({
      ...provided,
      border: '1px solid',
      boxShadow: 'none',
      borderColor: theme.palette.secondary.lightest,
      marginTop: 0,
      borderRadius: '0px 0px 2px 2px',
      overflowY: 'auto',
    }),
    input: () => ({
      color: theme.palette.secondary.light,
      '& input': {
        fontFamily: 'inherit',
      },
    }),
    placeholder: () => ({
      color: theme.palette.secondary.light,
      position: 'absolute',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: () => ({
      padding: '0px',
      maxHeight: '380px',
      overflowY: 'auto',
    }),
    group: () => ({
      padding: '0px',
    }),
    groupHeading: () => ({
      textAlign: 'center',
      fontSize: '12px',
      padding: '5px',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
      background: theme.palette.secondary.lightest,
      color: theme.palette.text.secondary,
    }),
    dropdownIndicator: () => ({
      color: theme.palette.secondary.light,
      padding: theme.spacing(0.5, 1, 0, 1),
      cursor: 'pointer',
      '&:hover': {
        color: fade(theme.palette.secondary.light, 0.8),
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      color: theme.palette.secondary.light,
      margin: 0,
    }),
    valueContainer: () => ({
      minHeight: '38px',
      maxHeight: '100%',
      alignItems: 'center',
      display: 'flex',
      flex: '1',
      padding: '2px 8px',
      position: 'relative',
      overflow: 'hidden',
      flexWrap: 'wrap',
    }),
    multiValue: styles => ({
      ...styles,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(3),
      height: 28,
      minWidth: 'unset',
      padding: '1px 8px',
      border: `1px solid ${theme.palette.secondary.lightest}`,
      alignItems: 'center',
      '& > div': {
        lineHeight: 1,
      },
      '& > * .MuiChip-root': {
        border: 'none',
        height: 'unset',
      },
    }),
    multiValueLabel: styles => ({
      ...styles,
      borderRadius: 0,
      padding: 0,
    }),
    multiValueRemove: styles => ({
      ...styles,
      paddingRight: 'unset',
      color: theme.palette.text.secondary,
      ':hover': {
        color: theme.palette.secondary.main,
      },
    }),
    indicatorsContainer: styles => ({
      ...styles,
      alignItems: 'flex-start',
      paddingTop: theme.spacing(0.5),
    }),
  };
}

export default {
  CustomReactSelectStyles,
  ReactSelectUseStyles,
};
