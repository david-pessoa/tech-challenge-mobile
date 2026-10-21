import { useTheme as useStyledTheme } from 'styled-components/native';

export function useTheme() {
  return useStyledTheme().colors;
}
