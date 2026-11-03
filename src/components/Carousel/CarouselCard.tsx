import { materias } from "@/types/Materias";
import { Post } from "@/types/Posts";
import { Card, DescriptionContainer, DescriptionText, IconContainer, MateriaSubTitle, MateriaTitle, PostTitle } from "./styles";
import { useWindowDimensions } from "react-native";
import { formatarData } from "@/utils/functions";

type CarouselCardProps = {
  dado: Post;
};

export default function CarouselCard({ dado }: CarouselCardProps) {
  const { width } = useWindowDimensions();
  
  const materiaName = dado?.subject?.nome ?? 'Geral';
  const materiaConfig = materias[materiaName];
  const MateriaIcon = materiaConfig.icon;

  return (
    <Card $screenWidth={width}>
      <IconContainer $backgroundColor={materiaConfig.backgroundColor} $screenWidth={width}>
        <MateriaIcon />
        <MateriaTitle $color={materiaConfig.color} $screenWidth={width}>{materiaName}</MateriaTitle>
      </IconContainer>
      <DescriptionContainer>
        <MateriaSubTitle $color={materiaConfig.color} $screenWidth={width}>{materiaName}</MateriaSubTitle>
        <PostTitle $screenWidth={width}>{dado.titulo}</PostTitle>
        <DescriptionText $screenWidth={width}>
          Publicado em {formatarData(dado.dataCriacao)} por {dado?.criadoPor?.nome}
        </DescriptionText>
      </DescriptionContainer>
    </Card>
  )

}