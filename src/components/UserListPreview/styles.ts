import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';
import { theme } from '@/styles/Theme';
import { StyleSheet } from 'react-native';

export const MessageContainer = styled.View<ResponsiveProps>`
  align-items: center;
  width: ${({ $screenWidth }) => ($screenWidth > 600 ? 400 : '70vw')};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 'auto';
  margin-right: 'auto';
`;

export const Message = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 24 : 16)}px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #021c41;
  width: 250px;
`;

export const UserListContainer = styled.View<ResponsiveProps>`
  padding-top: ${({ $screenWidth }) => ($screenWidth > 900 ? 29 : 16)}px;
  padding-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 29 : 16)}px;
  padding-right: ${({ $screenWidth }) => ($screenWidth > 900 ? 20 : 6)}px;
  padding-left: ${({ $screenWidth }) => ($screenWidth > 900 ? 20 : 6)}px;
  width: ${({ $screenWidth }) => ($screenWidth > 900 ? '100%' : '90%')};
  border-width: 1px;
  border-style: solid;
  border-color: #f0d2c7;
  border-radius: 7px;
  margin-top: 0;
  margin-right: ${({ $screenWidth }) => ($screenWidth > 900 ? 0 : 'auto')};
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 0 : 58)}px;
  margin-left: ${({ $screenWidth }) => ($screenWidth > 900 ? 0 : 'auto')};
`;

export const UserListTitle = styled.Text<ResponsiveProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 12 : 16)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

export const UserList = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
`;

export const Item = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f0d2c7;
`;

export const LastItem = styled(Item)`
  border-bottom-width: 0;
`;

export const UserProfilePhoto = styled.Image`
  width: 31px;
  height: 31px;
  border-radius: 50%;
  margin-left: 10px;
`;

export const UserNameRoleContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

export const UserRole = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const ActionContainer = styled.View`
  gap: 10px;
  margin-right: 10px;
`;

export const DeleteButton = styled.Pressable`
  border: none;
  background: transparent;
`;

export const EditButton = DeleteButton;

export const AccessUserListButton = styled.Pressable`
  color: #32434d;
  font-weight: 600;
  flex-direction: row;
  align-items: center;
`;

export const SentenceText = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: #32434d;
`;

export function createStyles(width: number) {
  const tablet = width >= 600;

  return StyleSheet.create({
    optionsOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: 'rgba(50, 67, 77, 0.3)',
    },
    optionsTitle: {
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
    },
    deleteDialog: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      gap: 12,
    },
    deleteMessage: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.text,
    },
    deleteActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    dialogButton: {
      minHeight: 44,
      minWidth: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
      paddingHorizontal: 16,
    },
    cancelDeleteButton: { borderWidth: 1, borderColor: theme.colors.primary },
    confirmDeleteButton: { backgroundColor: '#E64B63' },
    cancelDeleteText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: 14,
      color: theme.colors.primary,
    },
    confirmDeleteText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: 14,
      color: '#FFFFFF',
    },
    disabled: { opacity: 0.35 },
    UserList: {
      boxShadow: '0px 1px 4.9px 0px rgba(0,0,0, 0.36)'
    }
  });
}
