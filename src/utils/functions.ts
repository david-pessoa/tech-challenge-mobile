export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function buildApiImageUrl(image: string | null, cacheKey?: string | number) {
  if (!image) {
    return '';
  }

  const separator = image.includes('?') ? '&' : '?';
  const cacheParam = cacheKey ? `${separator}v=${cacheKey}` : '';

  if (image.startsWith('http')) {
    return `${image}${cacheParam}`;
  }


  return `${BASE_URL}${image}${cacheParam}`;
}

export function formatarData(data: string | Date | undefined) {
  if(!data) {
    return '--'
  }

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('pt-BR').format(dataConvertida);
};
