import styled from 'styled-components/native';

export const SafeRoot = styled.SafeAreaView`
  flex: 1;
`;

export const Root = styled.FlatList`
  flex: 1;
  background-color: #fff9e9;
`;

export const Header = styled.View`
  display: flex;
  width: 100%;
  height: 80px;
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: center;
  align-items: center;
  background-color: #fff9e9;
`;

export const Logo = styled.Image`
  width: 47px;
  height: 47px;
`;

export const HeaderText = styled.Text`
  font-weight: 900;
  font-size: 18px;
  color: #000000;
  margin-left: 15px;
`;

export const PlusView = styled.TouchableOpacity`
  margin-left: auto;
`;

export const PlusText = styled.Text`
  font-weight: 900;
  font-size: 38px;
  color: #afec80;
`;

export const Todo = styled.View`
  
`;

export const TodoView = styled.TouchableOpacity`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff9e9;
`;

export const TodoText = styled.Text`
  font-weight: 500;
  font-size: 20px;
  color: #000000;
  margin-left: 10px;
  margin-right: 40px;
`;

export const CompleteTodoText = styled.Text`
  font-weight: 500;
  font-size: 20px;
  color: #c0c0c0;
  text-decoration: line-through;
  text-decoration-color: #c0c0c0;
  margin-left: 10px;
  margin-right: 40px;
`;

export const Border = styled.View`
  width: 100%;
  height: 1px;
  background-color: #ca95ff;
`;

export const DelView = styled.TouchableOpacity`
  width: 80px;
  height: 40px;
  background-color: red;
  position: absolute;
  right: 2px;
  z-index: -1;
  border-radius: 10px;
`;

export const DelText = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: white;
  text-align: center;
  line-height: 45px;
`;

export const ModalRoot = styled.SafeAreaView`
  background-color: rgba(0, 0, 0, 0.5);\
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.View`
  width: 85%;
  height: 240px;
  background-color: #fff9e9;
  border-radius: 15px;
`;

export const ModalTouchable = styled.TouchableWithoutFeedback`
  flex: 1;
`;

export const ModalTitle = styled.Text`
  font-weight: 700;
  font-size: 27px;
  color: #000000;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
`;

export const ModalTextInput = styled.TextInput`
  width: 85%;
  height: 130px;
  background-color: #ffffff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
  text-align-vertical: top;
  padding: 5px;
`;

export const ModalButton = styled.TouchableOpacity`
  width: 85%;
  height: 35px;
  margin-top: 10px;
  background-color: #ca95ff;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
`;

export const ModalButtonText = styled.Text`
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  line-height: 35px;
  color: #ffffff;
`;
