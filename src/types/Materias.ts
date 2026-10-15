export type MateriaConfig = {
  backgroundColor: string;
  color: string;
  icon: string;
};

export const materias: Record<string, MateriaConfig> = {
  'Ciências': {
    backgroundColor: '#A4CDC6',
    color: '#287C6D',
    icon: 'microbiology',
  },
  'História': {
    backgroundColor: '#E0A7E3',
    color: '#902995',
    icon: 'account_balance',
  },
  'Português': {
    backgroundColor: '#FCBBA3',
    color: '#AE4E2B',
    icon: 'menu_book',
  },
  'Matemática': {
    backgroundColor: '#A7CEE3',
    color: '#1D648A',
    icon: 'function',
  },
  Geografia: {
    backgroundColor: '#F3CE99',
    color: '#9D6719',
    icon: 'globe',
  },
  Geral: {
    backgroundColor: '#D9D9D9',
    color: '#666666',
    icon: 'category',
  },
  'Ensino Religioso': {
    backgroundColor: '#D8C4E8',
    color: '#7A4E9B',
    icon: 'church',
  },
};
