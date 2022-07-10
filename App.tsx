import React, {
  MutableRefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {Alert, Modal, Animated, View, Easing, ViewStyle} from 'react-native';
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

interface ISlideView {
  MainView: JSX.Element;
  left?: number;
  right?: number;
  rightBreak?: number;
  leftBreak?: number;
  LeftView?: JSX.Element;
  RightView?: JSX.Element;
  rootStyle?: ViewStyle;
  animationDuration?: number;
  setXRef?: MutableRefObject<{
    setXValue?: (value: number) => void;
    animateXValue?: (value: number) => void;
  }>;
}

const SlideView = ({
  MainView,
  left,
  right,
  rightBreak,
  leftBreak,
  LeftView,
  RightView,
  rootStyle,
  animationDuration,
  setXRef,
}: ISlideView) => {
  const AnimationX = useRef(new Animated.Value(0)).current;
  const X = useRef(0);

  useEffect(() => {
    if (setXRef) {
      setXRef.current = {
        setXValue: value => {
          X.current = value;
          AnimationX.setValue(value);
        },
        animateXValue: value => {
          X.current = value;

          Animated.timing(AnimationX, {
            useNativeDriver: true,
            toValue: X.current,
            duration: animationDuration ?? 200,
            easing: Easing.ease,
          }).start();
        },
      };
    }
  }, []);

  return (
    <>
      <PanGestureHandler
        onGestureEvent={({nativeEvent}) => {
          AnimationX.setValue(
            X.current !== 0
              ? X.current + nativeEvent.translationX
              : nativeEvent.translationX,
          );
        }}
        onHandlerStateChange={({nativeEvent}) => {
          if (nativeEvent.state === 5) {
            if (nativeEvent.translationX >= 0 && leftBreak) {
              X.current = nativeEvent.translationX < leftBreak ? leftBreak : 0;
            } else if (rightBreak) {
              X.current =
                nativeEvent.translationX < rightBreak * -1
                  ? rightBreak * -1
                  : 0;
            }

            Animated.timing(AnimationX, {
              useNativeDriver: true,
              toValue: X.current,
              duration: animationDuration ?? 200,
              easing: Easing.ease,
            }).start();
          }
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            ...(rootStyle ?? {}),
          }}>
          {LeftView && (
            <View
              style={{
                position: 'absolute',
                left: left ?? 0,
                zIndex: -1,
              }}>
              {LeftView}
            </View>
          )}
          {RightView ?? (
            <View
              style={{
                position: 'absolute',
                right: right ?? 0,
                zIndex: -1,
              }}>
              {RightView}
            </View>
          )}
          <Animated.View
            style={{
              transform: [
                {
                  translateX: AnimationX,
                },
                {
                  translateY: 0,
                },
              ],
            }}>
            {MainView}
          </Animated.View>
        </View>
      </PanGestureHandler>
    </>
  );
};

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
  const setXRef = useRef({
    setXValue: (_: number) => {},
  });

  return (
    <>
      <SlideView
        MainView={
          <TodoView
            activeOpacity={1}
            onPress={() => {
              setXRef.current.setXValue(0);
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
              setXRef.current.setXValue(0);
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
