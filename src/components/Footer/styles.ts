import styled from 'styled-components/native';

type ResponsiveProps = {
  $screenWidth: number;
};

export const FooterContainer = styled.View<ResponsiveProps>`
  background-color: #fff7de;
  width: 100%;
  height: ${({ $screenWidth }) => ($screenWidth > 700 ? 330 : 304)}px;
  border-top-left-radius: 45px;
  border-top-right-radius: 45px;
  justify-content: center;
  align-items: center;
  margin-top: 60px;

  shadow-color: #c0b58b;
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const Box = styled.View<ResponsiveProps>`
  width: 90%;
  height: ${({ $screenWidth }) =>
    $screenWidth > 700 ? '245px' : '93.12%'};
  border-width: 2px;
  border-style: solid;
  border-color: #d3cbaf;
  border-radius: 25px;
  padding-top: ${({ $screenWidth }) => ($screenWidth > 700 ? 26 : 16)}px;
  padding-bottom: ${({ $screenWidth }) => ($screenWidth > 700 ? 0 : 16)}px;
  padding-left: ${({ $screenWidth }) => ($screenWidth > 700 ? 39 : 11)}px;
  padding-right: ${({ $screenWidth }) => ($screenWidth > 700 ? 24 : 11)}px;

  shadow-color: #c0b58b;
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const LogoContainer = styled.View`
  align-items: center;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-weight: 500;
  font-size: 24px;
`;

export const Paragraph = styled.Text<{
  $screenWidth: number;
  $description?: boolean;
}>`
  font-weight: 400;
  font-size: ${({ $screenWidth }) => ($screenWidth > 700 ? 13 : 10)}px;
  margin-right: ${({ $description }) => ($description ? 30 : 0)}px;
`;

export const UpperContainer = styled.View<ResponsiveProps>`
  padding-bottom: ${({ $screenWidth }) => ($screenWidth > 700 ? 27 : 19)}px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #d3cbaf;
  flex-direction: ${({ $screenWidth }) => ($screenWidth > 700 ? 'row' : 'column')};
  justify-content: space-between;
`;

export const BottomContainer = styled.View<ResponsiveProps>`
  padding-top: ${({ $screenWidth }) => ($screenWidth > 700 ? 18 : 13)}px;
  flex-direction: row;
  justify-content: space-between;
  gap: ${({ $screenWidth }) => ($screenWidth > 700 ? 0 : 27)}px;
`;

export const LinksContainer = styled.View<ResponsiveProps>`
  width: 265px;
  flex-direction: row;
  gap: ${({ $screenWidth }) => ($screenWidth > 700 ? 51 : 10)}px;
  margin-top: ${({ $screenWidth }) => ($screenWidth > 700 ? 17 : 14)}px;
`;

export const OtherLinksList = styled.View`
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.Text<ResponsiveProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 700 ? 13 : 10)}px;
  text-decoration-line: underline;
`;
