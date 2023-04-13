import React, { useId, useState, useEffect, useRef, useMemo } from 'react'
import styled from "@emotion/styled";
import { css } from '@emotion/react';
import { inputCommon } from '../styles/common';

const Container = styled.div(props => [
  inputCommon(props),
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid transparent',
    // height: '100%',
    '&:focus-within': {
      border: `1px solid ${props.theme.colors.text}`,
    }
}]);

const Input = styled.input(props => ({
  border: 'none',
  backgroundColor: 'transparent',
  color: props.theme.colors.text,
  outline: 'none',
  width: '100%',
  height: '100%',
  flexGrow: 1,
}));

const Listbox = styled.ul(props => [
  {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: '10rem',
    overflow: 'auto',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    background: props.theme.colors.elements,
    border: `1px solid ${props.theme.colors.text}`,
  }
]);

const optionFocused = css({
  background: 'rgba(0, 0, 0, 0.1)',
});

type Props = {
  label: string;
  options: readonly string[];
  value: string;
  setValue: (value: string) => void;
}

type OptionProps = {
  label: string;
  setOptionId: (id: string) => void;
  setOptionCurrent: () => void;
  selectAndClose: () => void;
  visuallyFocused: boolean;
}

function ComboBoxOption({label, setOptionId, setOptionCurrent, visuallyFocused, selectAndClose}: OptionProps) {

  const optionId = useId();
  // console.log('optionId', optionId);

  const handleOptionClick = (e: React.MouseEvent) => {
    console.log('handleOptionClick');
    selectAndClose();
  }

  const handleOptionPointerOver = (e: React.PointerEvent) => {
    setOptionCurrent();
  }

  const handleOptionPointerOut = (e: React.PointerEvent) => {
    // nop for now
  }

  useEffect(() => {
    setOptionId(optionId);
  }, [optionId]);

  return (
    <li role="option"
      css={[visuallyFocused ? optionFocused : undefined, {
        padding: '0.5rem',
        cursor: 'pointer',
      }]}
      id={optionId}
      onClick={handleOptionClick}
      onPointerOver={handleOptionPointerOver}
      onPointerOut={handleOptionPointerOut} >{label}</li>
  )
}

function FilterComboBox({label, options, value, setValue}: Props) {
  const popupId = useId();
  const [expanded, setExpanded] = useState(false);
  // const [activeDescendant, setActiveDescendant] = useState('');
  // const [activeValue, setActiveValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const myRef = useRef<HTMLDivElement>(null);

  console.log("popupId", popupId);

  const optionIds = useRef<string[]>([]);
  const activeDescendant = useMemo(() => currentIndex >= 0 ? optionIds.current[currentIndex] : '',
    [currentIndex]);
  const activeValue = useMemo(() => currentIndex >= 0 ? options[currentIndex] : '', 
    [currentIndex]);

  const expand = (state: boolean) => {
    if (expanded === state) return;
    if (state) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(-1);
    }
    setExpanded(state);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.shiftKey || e.altKey) return;
    let handled = false;
    switch (e.key) {
      case 'Enter':
        // accept the current value
        if (expanded) {
          setValue(activeValue);
          expand(false);
          handled = true;
        }
        break;
      case 'Down':
      case 'ArrowDown':
        if (!expanded) {
          expand(true);
          handled = true;
        } else {
          if (currentIndex < options.length - 1) {
            setCurrentIndex(currentIndex + 1);
            handled = true;
          }
        }
        break;
      case 'Up':
      case 'ArrowUp':
        if (expanded) {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            handled = true;
          }
        }
        break;
      case 'Escape':
      case 'Esc':
        if (expanded) {
          expand(false);
          handled = true;
        }
        break;
      case 'Tab':
        if (expanded) {
          setValue(activeValue);
          expand(false);
        }
        break;
      case 'Home':
        if (expanded) {
          setCurrentIndex(0);
          handled = true;
        }
        break;
      case 'End':
        if (expanded) {
          setCurrentIndex(options.length - 1);
          handled = true;
        }
        break;
      default:
        break;
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const handleFocus = (e: React.FocusEvent) => {
    // NOP ?
  }

  const handleBlur = (e: React.FocusEvent) => {
    console.log("handleBlur");
    // if (expanded && currentIndex >= 0) {
    //   handleOptionSelected(currentIndex);
    // }

    // set timeout allows for the click event to be processed first
    // but this is not a good solution of course
    setTimeout(() => {
      if (expanded) {
        expand(false);
      }
    }, 500);
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!expanded) {
      expand(true);
    }
    console.log("handleClick");
  }

  const handleOptionSelected = (optionIndex: number) => {
    console.log('handleOptionSelected', optionIndex);
    setValue(options[optionIndex]);
    expand(false);
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    expand(!expanded);
  }

  /* useEffect(() => {
    document.body.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.body.removeEventListener('pointerup', handlePointerUp);
    }
  }, []); */

  return (
    <Container ref={myRef}>
      <Input role="combobox"
        aria-label={label}
        placeholder={label}
        type="text"
        aria-controls={popupId}
        aria-expanded={expanded ? 'true' : 'false'}
        aria-activedescendant={activeDescendant || undefined} 
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        value={value}
        aria-autocomplete='none'
        readOnly />
      <i className="fa-solid fa-times" css={value ? {cursor: 'pointer'} : {opacity: 0}} onClick={() => setValue('')} aria-label="clear filter"></i>
      <i className={`fa-solid fa-chevron-down ${expanded ? 'fa-rotate-180' : ''}`} onClick={handleChevronClick} css={{cursor: 'pointer', marginLeft: '0.5rem'}} aria-label=""></i>
      <Listbox role="listbox" id={popupId} css={!expanded ? {display: 'none'} : ''} >
        {options.map((option, index) => (
          <ComboBoxOption 
            key={index} 
            label={option} 
            setOptionId={(id) => { optionIds.current[index] = id;}} 
            setOptionCurrent={() => setCurrentIndex(index)}
            selectAndClose={() => handleOptionSelected(index)}
            visuallyFocused={currentIndex === index} />
        ))}
      </Listbox>
    </Container>
  )
}

export default FilterComboBox
