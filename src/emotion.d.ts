import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      elements: string;
      background: string;
      text: string;
      input: string;
      shadow: string;
      header: string;
    },
    breakpoints: {
      mobile: string;
    }
  }
}