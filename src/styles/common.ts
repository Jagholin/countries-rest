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

export const flexLayout = (gap: string, itemHeight?: string, wrap?: boolean) => css({
  display: 'flex',
  flexWrap: wrap ? 'wrap' : 'nowrap',
  gap,
  '& > *': {
    minHeight: itemHeight ? `${itemHeight}` : 'auto',
    alignSelf: 'stretch',
  }
});

export const grow = css({
  flexGrow: 1,
});

export const inputCommon = ({theme} : {theme: Theme}) => css(({
  border: '1px solid transparent',
  borderRadius: '0.5rem',
  boxShadow: `0 0 var(--shadow-size) ${theme.colors.shadow}`,
  padding: '0.5rem 1rem',
  cursor: 'text',
  background: theme.colors.elements,
  color: theme.colors.text,
  '&:focus-within': {
    border: `1px solid ${theme.colors.text}`,
  }
}));

export const colorsCommon = ({theme} : {theme: Theme}) => css({
  color: theme.colors.text,
  backgroundColor: theme.colors.background,
});

export const textBold = css({
  fontWeight: 600,
});

export const textBolder = css({
  fontWeight: 800,
})

export const textBig = css({
  fontSize: 16,
})

export const textBigger = css({
  fontSize: 18,
})
