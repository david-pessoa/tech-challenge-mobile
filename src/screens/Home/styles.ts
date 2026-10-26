import styled from "styled-components/native";

export const MainText = styled.Text`
  font-size: 24px;
  color: black;
  font-family: Arial;
  text-align: center;
`;

export const HomeView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const LogoutButton = styled.Pressable`
  padding: 10px 28px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const LogoutText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;