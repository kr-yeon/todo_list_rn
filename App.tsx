import React, {Suspense, useState} from 'react';
import {
  Header,
  Root,
  Logo,
  HeaderText,
  PlusView,
  PlusText,
  SafeRoot,
  TodoView,
  TodoText,
  Border,
  DelText,
  DelView,
  Todo,
  CompleteTodoText,
  ModalRoot,
  ModalView,
  ModalTitle,
  ModalTextInput,
  ModalTouchable,
  ModalButton,
  ModalButtonText,
} from './components';
import {Alert, Modal} from 'react-native';
import {RecoilRoot, useRecoilState} from 'recoil';
import {todo_list} from './recoilState';

interface ITodos {
  value: string;
  complete: boolean;
}

const Application = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [todo, setTodo] = useRecoilState<Array<ITodos>>(todo_list);

  return (
    <SafeRoot>
      <Modal visible={modalVisible} animationType={'slide'} transparent={true}>
        <ModalTouchable
          onPress={() => {
            setInput('');
            setModalVisible(false);
          }}>
          <ModalRoot>
            <ModalView>
              <ModalTitle>추가해바</ModalTitle>
              <ModalTextInput
                onChangeText={setInput}
                value={input}
                multiline={true}
                placeholder={'적어바'}
              />
              <ModalButton
                onPress={() => {
                  if (input === '') {
                    Alert.alert('todo를 입력해주세요.');
                  } else {
                    setTodo([
                      {
                        value: input,
                        complete: false,
                      },
                      ...todo,
                    ]);
                    setInput('');
                    setModalVisible(false);
                  }
                }}>
                <ModalButtonText>추가하기</ModalButtonText>
              </ModalButton>
            </ModalView>
          </ModalRoot>
        </ModalTouchable>
      </Modal>
      <Root
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
            <Header>
              <Logo
                source={require('./assets/icon.png')}
                resizeMode={'contain'}
              />
              <HeaderText>오늘도 열심히 해보자!</HeaderText>
              <PlusView onPress={() => setModalVisible(true)}>
                <PlusText>+</PlusText>
              </PlusView>
            </Header>
            <Border />
          </>
        }
        data={[
          ...todo.filter(s => !s.complete),
          ...todo.filter(s => s.complete),
        ]}
        renderItem={({item, index}: {item: ITodos; index: number}) => {
          return (
            <>
              <Todo>
                <TodoView
                  onPress={() => {
                    setTodo([
                      {
                        ...item,
                        complete: !item.complete,
                      },
                      ...[
                        ...todo.filter(s => !s.complete),
                        ...todo.filter(s => s.complete),
                      ].filter((_, i) => i !== index),
                    ]);
                  }}>
                  {item.complete ? (
                    <CompleteTodoText>{item.value}</CompleteTodoText>
                  ) : (
                    <TodoText>{item.value}</TodoText>
                  )}
                </TodoView>
                <DelView
                  onPress={() => {
                    setTodo(
                      [
                        ...todo.filter(s => !s.complete),
                        ...todo.filter(s => s.complete),
                      ].filter((_: ITodos, i: number) => i !== index),
                    );
                  }}>
                  <DelText>X</DelText>
                </DelView>
              </Todo>
              <Border />
            </>
          );
        }}
      />
    </SafeRoot>
  );
};

export default function () {
  return (
    <Suspense fallback={<SafeRoot />}>
      <RecoilRoot>
        <Application />
      </RecoilRoot>
    </Suspense>
  );
}
