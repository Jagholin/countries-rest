import { Outlet } from "react-router-dom";
import { Theme, ThemeProvider, Global } from "@emotion/react";
import { useCallback, useState } from "react";

import styled from "@emotion/styled";
import { colorsCommon, topLevelPadding } from "./styles/common";

const darkTheme = {
  colors: {
    elements: 'hsl(209, 23%, 22%)',
    background: 'hsl(207, 26%, 17%)',
    text: 'hsl(0, 0%, 100%)',
    input: 'hsl(209, 23%, 22%)',
    shadow: 'hsl(0, 0%, 50%)',
    header: '#2b3743',
  },
  breakpoints: {
    mobile: '500px',
  }
} as Theme;

const lightTheme = {
  colors: {
    elements: 'hsl(0, 0%, 100%)',
    background: 'hsl(0, 0%, 98%)',
    text: 'hsl(200, 15%, 8%)',
    input: 'hsl(0, 0%, 52%)',
    shadow: 'hsl(0, 0%, 50%)',
    header: '#fff',
  },
  breakpoints: {
    mobile: '500px',
  }
} as Theme;

const Header = styled.header(props => [
  topLevelPadding,
  colorsCommon,
  {
    boxShadow: `0 0 var(--shadow-size) ${props.theme.colors.shadow}`,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: props.theme.colors.header,
  }
]);

const Main = styled.main(props => [
  topLevelPadding,
]);

const DarkModeSwitch = styled.button(props => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: props.theme.colors.text,
}))

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = useCallback(() => {
    setDarkMode(mode => !mode);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Global styles={{
        body: {
          color: darkMode ? darkTheme.colors.text : lightTheme.colors.text,
          backgroundColor: darkMode ? darkTheme.colors.background : lightTheme.colors.background,
        },
      }} />
      <Header>
        <h1>Where in the&nbsp;world?</h1>
        <DarkModeSwitch onClick={handleDarkMode}>
          {darkMode ? <i className="fa-regular fa-moon"></i> : <i className="fa-solid fa-moon"></i>}&nbsp;
          Dark&nbsp;Mode
        </DarkModeSwitch>
      </Header>
      <Main className="App">
        <Outlet />
      </Main>
    </ThemeProvider>
  )
}

export default App
