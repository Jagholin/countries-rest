import { css, Theme } from '@emotion/react';

export const breakpointMobile = (theme: Theme) => `@media (min-width: ${theme.breakpoints.mobile})`;

export const topLevelPadding = ({theme} : {theme: Theme}) => css({
  padding: '3rem 1rem',
  [breakpointMobile(theme)]: {
    padding: '1rem 3rem',
  }
});

export const gridLayout = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(var(--element-size), 1fr))',
});

export const inputCommon = ({theme} : {theme: Theme}) => css(({
  border: 'none',
  borderRadius: '0.5rem',
  boxShadow: `0 0 var(--shadow-size) ${theme.colors.shadow}`,
}));

export const colorsCommon = ({theme} : {theme: Theme}) => css({
  color: theme.colors.text,
  backgroundColor: theme.colors.background,
});
