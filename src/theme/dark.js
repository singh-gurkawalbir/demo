import { darken, alpha } from '@mui/material/styles';

import colors from './colors';

export default {
  name: 'Celigo Dark Theme',
  appBar: {
    background: colors.celigoNeutral8,
    contrast: colors.celigoWhite,
    hover: colors.celigoWhite,
  },
  selectFormControl: {
    color: colors.celigoNeutral9,
    background: colors.celigoNeutral8,
    hover: darken(colors.celigoNeutral7, 0.6),
    text: colors.celigoNeutral5,
    separator: colors.celigoNeutral6,
  },
  palette: {
    mode: 'dark',
    background: {
      paper: colors.celigoNeutral9,
      paper2: colors.celigoNeutral5,
      default: colors.celigoNeutral8,
      main: colors.celigoAccent3,
      arrowAfter: colors.celigoNeutral6,
      drawer: colors.celigoNeutral9,
      drawer2: colors.celigoNeutral9,
      drawer3: colors.celigoNeutral90,
      drawerActive: colors.celigoAccent1,
      toggle: colors.celigoNeutral7,
    },
    primary: {
      backgroundColor: colors.celigoAccent1,
      color: colors.celigoWhite,
      main: colors.celigoAccent3,
      lightest2: colors.celigoAccent6,
      lightest: colors.celigoAccent5,
      light: colors.celigoAccent3,
      dark: colors.celigoAccent1,
    },
    secondary: {
      light: colors.celigoNeutral3,
      main: colors.celigoNeutral3,
      lightest: colors.celigoNeutral3,
      dark: colors.celigoNeutral9,
      darkest: colors.celigoNeutral90,
      contrastText: colors.celigoNeutral4,
    },
    text: {
      primary: colors.celigoNeutral9,
      link: colors.celigoNeutral6,
      linkHover: colors.celigoAccent1,
      secondary: colors.celigoNeutral4,
      title: colors.celigoWhite,
      disabled: colors.celigoNeutral4,
      hint: colors.celigoNeutral5,
    },
    info: {
      main: colors.celigoAccent2,
      contrastText: colors.celigoWhite,
    },
    error: {
      main: colors.celigoError,
      dark: colors.celigoErrorDark,
      contrastText: colors.celigoWhite,
    },
    warning: {
      main: colors.celigoWarning,
      contrastText: colors.celigoWhite,
    },
    success: {
      main: colors.celigoSuccess,
      dark: colors.celigoSuccessDark,
      contrastText: colors.celigoWhite,
    },
    divider: colors.celigoNeutral6,
  },
  overrides: {
    MuiTypography: {
      root: { color: colors.celigoNeutral3 },
      body2: { color: colors.celigoNeutral3 },
      body1: { color: colors.celigoNeutral3 },
      h1: { color: colors.celigoNeutral3 },
      h2: { color: colors.celigoNeutral3 },
      h3: { color: colors.celigoNeutral3 },
      h4: { color: colors.celigoNeutral3 },
      h5: { color: colors.celigoNeutral3 },
      h6: { color: colors.celigoNeutral9 },
      subtitle1: { color: colors.celigoNeutral9 },
      subtitle2: { color: colors.celigoNeutral9 },
      overline: { color: colors.celigoNeutral3 },
      caption: { color: colors.celigoNeutral9 },
    },
    MuiButton: {
      textPrimary: {
        color: colors.celigoNeutral9,
        '&:focus': {
          color: colors.celigoAccent2,
        },
        '&:hover': {
          color: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral6,
        },
      },
      textSecondary: {
        color: colors.celigoNeutral3,
        '&::after': {
          backgroundColor: colors.celigoAccent3,
        },
        '&:focus': {
          color: colors.celigoAccent1,
        },
        '&:hover': {
          color: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral5,
        },
      },
      outlined: {
        backgroundColor: colors.celigoAccent3,
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral5,
        },
      },
      outlinedPrimary: {
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoAccent4,
          borderColor: colors.celigoAccent3,
        },
        '&:focus': {
          background: colors.celigoAccent2,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral5,
          borderColor: colors.celigoNeutral4,
        },
      },
      outlinedSecondary: {
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral5,
        },
      },

      // rounded buttons styles
      contained: {
        backgroundColor: colors.celigoNeutral5,
        borderColor: colors.celigoNeutral5,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoNeutral5,
          borderColor: colors.celigoNeutral4,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral4,
        },
      },
      containedPrimary: {
        backgroundColor: colors.celigoAccent3,
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoAccent4,
          borderColor: colors.celigoAccent4,
          color: colors.celigoWhite,
        },
        '&:focus': {
          background: colors.celigoAccent2,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral5,
          borderColor: colors.celigoNeutral4,
        },
      },
      containedSecondary: {
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
        backgroundColor: 'transparent',
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: 'transparent',
          borderColor: colors.celigoNeutral7,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral4,
          backgroundColor: colors.celigoNeutral7,
        },
      },
    },
    MuiMenu: {
      paper: {
        backgroundColor: colors.celigoNeutral5,
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: colors.celigoNeutral7,
        borderColor: colors.celigoNeutral7,
      },
    },
    MuiPickersClock: {
      clock: {
        backgroundColor: colors.celigoNeutral5,
      },
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: colors.celigoWhite,
        height: 64,
      },
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: colors.celigoNeutral4,
      },
      toolbarBtnSelected: {
        color: colors.celigoNeutral8,
      },
    },
    MuiAvatar: {
      colorDefault: {
        color: colors.celigoNeutral9,
        backgroundColor: colors.celigoNeutral6,
      },
    },
    MuiListItem: {
      button: {
        '&:hover': { backgroundColor: colors.celigoNeutral7 },
      },
    },
    MuiMenuItem: {
      root: {
        borderBottom: `1px solid ${colors.celigoNeutral7}`,
        '&$selected': {
          backgroundColor: colors.celigoNeutral6,
          '&:before': {
            background: colors.celigoAccent3,
          },
          '&:hover': {
            backgroundColor: colors.celigoNeutral5,
          },
        },
        '&:hover': {
          background: colors.celigoNeutral5,
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
      },
    },
    MuiTableRow: {
      root: {
        background: colors.celigoNeutral5,
        '&:hover': {
          '&:hover': {
            background: colors.celigoNeutral5,
          },
        },
      },
      head: {
        '&:hover': {
          background: 'white !important',
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottomColor: colors.celigoNeutral7,
      },
      head: {
        color: colors.celigoNeutral8,
      },
    },
    MuiSelect: {
      icon: {
        color: colors.celigoNeutral3,
      },
    },
    MuiInput: {
      formControl: {
        background: colors.celigoNeutral5,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderColor: colors.celigoNeutral7,
        backgroundColor: colors.celigoWhite,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
      },
      notchedOutline: {
        border: `${colors.celigoNeutral7} !important`,
      },
    },
    MuiFormLabel: {
      root: {
        color: colors.celigoNeutral3,
      },
    },
    MuiFilledInput: {
      root: {
        background: colors.celigoNeutral5,
        '&:hover': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&$focused': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&.Mui-disabled': {
          backgroundColor: colors.celigoNeutral5,
          color: alpha(colors.celigoNeutral6, 0.8),
        },
      },
      input: {
        background: colors.celigoNeutral5,
        borderColor: colors.celigoNeutral7,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral5,
          color: alpha(colors.celigoNeutral6, 0.8),
          '&:hover': {
            borderColor: colors.celigoNeutral7,
          },
        },
      },
      multiline: {
        background: colors.celigoNeutral5,
        borderColor: colors.celigoNeutral7,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral5,
          color: alpha(colors.celigoNeutral6, 0.8),
        },
      },
    },
    MuiRadio: {
      root: {
        color: colors.celigoNeutral5,
        '&:hover': {
          color: colors.celigoAccent2,
        },
      },
    },
    MuiInputBase: {
      root: {
        '&$disabled': {
          backgroundColor: colors.celigoNeutral5,
          borderColor: `${colors.celigoNeutral7} !important`,
          color: alpha(colors.celigoNeutral6, 0.8),
        },
      },
    },
    MuiIconButton: {
      root: {
        color: colors.celigoNeutral3,
        '&:hover': {
          backgroundColor: colors.celigoNeutral5,
        },
      },
    },
    MuiDialogTitle: {
      root: {
        borderBottom: `1px solid ${colors.celigoNeutral7}`,
      },
    },
    MuiDialogContent: {
      root: {
        background: colors.celigoNeutral9,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: colors.celigoWhite,
        color: colors.celigoNeutral6,
        borderColor: colors.celigoNeutral7,
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: alpha(colors.celigoNeutral6, 0.7),
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.celigoNeutral7,
      },
    },
    MuiCheckbox: {
      root: {
        color: colors.celigoNeutral5,
        '&:hover': {
          color: colors.celigoAccent2,
        },
      },
      colorPrimary: {
        '&.Mui-disabled': {
          color: colors.celigoNeutral7,
        },
      },
    },
    MuiTabs: {
      scrollButtonsDesktop: {
        '& > svg': {
          borderColor: colors.celigoNeutral3,
        },
      },
    },
    MuiDrawer: {
      paper: {
        background: colors.celigoNeutral9,
      },
    },
    MuiTab: {
      textColorPrimary: {
        color: colors.celigoNeutral8,
      },
    },
    MuiSnackbarContent: {
      action: {
        color: colors.celigoNeutral8,
      },
      message: {
        color: colors.celigoNeutral8,
      },
      root: {
        backgroundColor: colors.celigoWhite,
        '&:before': {
          background: colors.celigoNeutral7,
        },
      },
    },
    MuiAccordionDetails: {
      root: {
        borderTop: `1px solid ${colors.celigoNeutral7}`,
      },
    },
    MuiAutocomplete: {
      option: {
        borderBottom: `1px solid ${colors.celigoNeutral7}`,
        '&[data-focus="true"]': {
          backgroundColor: colors.celigoNeutral5,
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:active': {
          backgroundColor: colors.celigoNeutral5,
        },
      },
    },
  },
};
