import React, {Suspense, useEffect, useRef, useState} from 'react';
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
  Todo,
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
import {Alert, Modal, Animated, View} from 'react-native';
import {RecoilRoot, useRecoilState} from 'recoil';
import {todo_list} from './recoilState';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

interface ITodos {
  value: string;
  complete: boolean;
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
  const AnimationXY = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;
  const XY = useRef({
    x: 0,
    y: 0,
  });

  return (
    <>
      <PanGestureHandler
        onGestureEvent={({nativeEvent}) => {
          XY.current.x = nativeEvent.translationX;
          AnimationXY.x.setValue(XY.current.x);
        }}
        onHandlerStateChange={({nativeEvent}) => {
          if (nativeEvent.state === 5) {
            XY.current.x = XY.current.x < -10 ? -60 : 0;
            Animated.timing(AnimationXY, {
              useNativeDriver: true,
              toValue: {
                x: XY.current.x < -60 ? -60 : 0,
                y: 0,
              },
              duration: 200,
            }).start();
          }
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <DelView>
            <DelText>X</DelText>
          </DelView>
          <Animated.View
            style={{
              transform: [
                {
                  translateX: AnimationXY.x,
                },
                {
                  translateY: 0,
                },
              ],
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TodoView
              activeOpacity={1}
              onPress={() => {
                XY.current.x = 0;
                Animated.timing(AnimationXY, {
                  useNativeDriver: true,
                  toValue: {
                    x: 0,
                    y: 0,
                  },
                  duration: 200,
                }).start();
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
          </Animated.View>
        </View>
      </PanGestureHandler>
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
