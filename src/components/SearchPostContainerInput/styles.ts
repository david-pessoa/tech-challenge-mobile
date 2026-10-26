import styled from 'styled-components/native';

export const InputContainer = styled.Pressable`
  position: relative;
  background-color: #fde9a06b;
  border-radius: 20px;
  min-height: 2.625rem;
  width: 38rem;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;

  /* @media (max-width: 900px) {
    min-height: 2.438rem;
    padding: 9px;
  }

  @media (max-width: 600px) {
    min-height: 1.313rem;
    padding: 3px;
  } */
`;

export const InnerInputContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  /* @media (max-width: 600px) {
    min-height: 1.313rem;
    padding: 0 6px;

    span {
      font-size: 1rem
    }
  } */
`;

export const ResultsList = styled.ScrollView`
  position: absolute;
  width: 100%;
  padding: 15px;
  left: 0;
  top: calc(70%);
  box-sizing: border-box;
  z-index: 100;
  list-style: none;
  margin-top: 5px;
  background-color: #fef4d0;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  text-overflow: ellipsis;

  /* @media (max-width: 900px) {
    top: calc(55%);
    padding: 9px
  } */
`;

export const ListItemButton = styled.Pressable`
  display: flex;
  margin-top: 10px;
  align-items: center;
  color: inherit;
  text-decoration: none;
  height: 2.5rem;
  border-radius: 10px;
  padding: 2px;

  &:hover {
    background-color: #ccc0986b;
  }

  &:active {
    background-color: #6f674c6b;
  }

  /* @media (max-width: 600px) {
    margin: 0;
    height: 1.5rem;
  } */
`;

export const ListItem = styled.Text`
  display: flex;
  gap: 2.5rem;
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 15rem;
    white-space: nowrap;
  }

  /* @media (max-width: 600px) {
    gap: 1rem;
  } */
`;

export const InputSearch = styled.TextInput`
  border: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
  }

  /* @media (max-width: 600px) {
    font-size: 10px;
  } */
`;