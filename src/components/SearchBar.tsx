import React, { ReactNode } from 'react'
import {} from '@emotion/react/types/css-prop';
import { css } from '@emotion/react';
import { inputCommon } from '../styles/common';

type Props = {
  labelText: ReactNode;
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
}

function SearchBar({labelText, value, setValue, placeholder, ...props}: Props) {
  return (
    <label role='search' css={theme => css([
      inputCommon({theme}),
      {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }
    ])}
    {...props} >
      <div> {labelText} </div>
      <input type="text" aria-label='Search query' autoFocus placeholder={placeholder} css={{
        border: 'none', 
        outline: 'none',
        flexGrow: 1,
        display: 'block',
        alignSelf: 'stretch',
        background: 'transparent',
        color: 'inherit',
        }}
        value={value} onChange={(e) => setValue?.(e.target.value)} />
    </label>
  )
}

export default SearchBar
