import React, {Suspense, useRef, useState} from 'react';
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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SlideView, {ISetXRef} from './components/SlideView';

interface ITodos {
  value: string;
  complete: boolean;
  date: number;
}

const TodoTouch = ({
  todo,
  setTodo,
  item,
  index,
}: {
  todo: Array<ITodos>;
  setTodo: (todos: Array<ITodos>) => void;
  item: ITodos;
  index: number;
}) => {
  const setXRef = useRef<ISetXRef>({
    setXValue: (_: number) => {},
  });
  const slideRef = useRef(0);

  return (
    <>
      <SlideView
        MainView={
          <TodoView
            activeOpacity={1}
            onPress={() => {
              setXRef.current.animateXValue && setXRef.current.animateXValue(0);
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
        }
        setXRef={setXRef}
        animationDuration={200}
        rightBreak={85}
        RightView={
          <DelView
            onPress={() => {
              setXRef.current.animateXValue && setXRef.current.animateXValue(0);
              setTodo(
                [
                  ...todo.filter(s => !s.complete),
                  ...todo.filter(s => s.complete),
                ].filter((_: ITodos, i: number) => i !== index),
              );
            }}>
            <DelText>삭제</DelText>
          </DelView>
        }
        slide={slideRef}
      />
      <Border />
    </>
  );
};

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
                        date: Date.now(),
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
            <TodoTouch
              todo={todo}
              setTodo={setTodo}
              item={item}
              index={index}
              key={item.value}
            />
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
        <GestureHandlerRootView style={{flex: 1}}>
          <Application />
        </GestureHandlerRootView>
      </RecoilRoot>
    </Suspense>
  );
}
