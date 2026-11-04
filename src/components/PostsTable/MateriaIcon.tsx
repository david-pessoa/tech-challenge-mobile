import { materias } from '@/types/Materias';
import { ResponsiveProps } from '@/types/Props';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';

export const MateriaContainer = styled.View<ResponsiveProps>`
  align-items: center;
  max-width: 50px;
`;

type ColorProps = {
  $backgroundColor: string;
  $color: string;
} & ResponsiveProps;

export const IconContainer = styled.View<ColorProps>`
  height: ${({ $screenWidth }) => ($screenWidth > 600 ? 42 : 31)}px;
  width: ${({ $screenWidth }) => ($screenWidth > 600 ? 42 : 31)}px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  color: ${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

type FontColorProps = {
  $color: string;
} & ResponsiveProps;

export const MateriaTitle = styled.Text<FontColorProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 12 : $screenWidth > 600 ? 10 : 8)}px;
  color: ${({ $color }) => $color};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;

type MateriaIconContainerProps = {
  subject: string;
};

export default function MateriaIconContainer({ subject }: MateriaIconContainerProps) {
  const { width } = useWindowDimensions();
  const backgroundColor = materias[subject].backgroundColor;
  const fontColor = materias[subject].color;
  const Icon = materias[subject].icon;

  return (
    <MateriaContainer $screenWidth={width}>
      <IconContainer $screenWidth={width} $backgroundColor={backgroundColor} $color={fontColor}>
        <Icon size={width > 900 ? 32 : width > 600 ? 20 : 15} />
      </IconContainer>
      <MateriaTitle $color={fontColor} $screenWidth={width}>
        {subject}
      </MateriaTitle>
    </MateriaContainer>
  );
}
