import {
  AccountBalance,
  Category,
  Church,
  Function,
  Globe,
  MaterialSymbolsComponent,
  MenuBook,
  Microbiology,
} from '@material-symbols-svg/react-native';

export type MateriaConfig = {
  backgroundColor: string;
  color: string;
  icon: MaterialSymbolsComponent;
};

export const materias: Record<string, MateriaConfig> = {
  Ciências: {
    backgroundColor: '#A4CDC6',
    color: '#287C6D',
    icon: Microbiology,
  },
  História: {
    backgroundColor: '#E0A7E3',
    color: '#902995',
    icon: AccountBalance,
  },
  Português: {
    backgroundColor: '#FCBBA3',
    color: '#AE4E2B',
    icon: MenuBook,
  },
  Matemática: {
    backgroundColor: '#A7CEE3',
    color: '#1D648A',
    icon: Function,
  },
  Geografia: {
    backgroundColor: '#F3CE99',
    color: '#9D6719',
    icon: Globe,
  },
  Geral: {
    backgroundColor: '#D9D9D9',
    color: '#666666',
    icon: Category,
  },
  'Ensino Religioso': {
    backgroundColor: '#D8C4E8',
    color: '#7A4E9B',
    icon: Church,
  },
};
