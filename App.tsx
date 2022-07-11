import React, {
  MutableRefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Header,
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
} from './styles';
import {
  Alert,
  Animated,
  Easing,
  FlatListProps,
  Modal,
  ScrollView,
  Vibration,
  View,
} from 'react-native';
import {RecoilRoot, useRecoilState} from 'recoil';
import {todo_list} from './recoilState';
import {
  GestureHandlerRootView,
  FlatList,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import SlideView, {ISetXRef} from './components/SlideView';
import DraggableFlatList from "react-native-draggable-flatlist";

interface ITodos {
  value: string;
  complete: boolean;
  date: number;
}

// interface IListItem {
//   item: any;
//   index: number;
//   children: JSX.Element;
//   setData: (value: any) => void;
// }
//
// interface IMoveFlatList extends FlatListProps<any> {
//   setData: (value: any) => void;
// }
//
// const ListItem = (props: IListItem) => {
//   const animatedXY = useRef(
//     new Animated.ValueXY({
//       x: 0,
//       y: 0,
//     }),
//   ).current;
//   const [zIndex, setZIndex] = useState(0);
//   const firstTouch = useRef({
//     x: 0,
//     y: 0,
//   });
//   const [height, setHeight] = useState(0);
//
//   return (
//     <View
//       style={{
//         height: height,
//         zIndex: zIndex,
//       }}>
//       <LongPressGestureHandler
//         maxDist={9999999}
//         minDurationMs={350}
//         onActivated={() => {
//           setZIndex(99);
//           Vibration.vibrate(200);
//           firstTouch.current.x = 0;
//           firstTouch.current.y = 0;
//         }}
//         onHandlerStateChange={({nativeEvent}) => {
//           if (nativeEvent.state === 5) {
//             firstTouch.current.x = 0;
//             firstTouch.current.y = 0;
//             Animated.timing(animatedXY, {
//               useNativeDriver: true,
//               toValue: {
//                 x: 0,
//                 y: 0,
//               },
//               duration: 200,
//               easing: Easing.ease,
//             }).start();
//           }
//         }}
//         onGestureEvent={({nativeEvent}) => {
//           if (firstTouch.current.x === 0) {
//             firstTouch.current.x = nativeEvent.absoluteX;
//           }
//           if (firstTouch.current.y === 0) {
//             firstTouch.current.y = nativeEvent.absoluteY;
//           }
//           animatedXY.setValue({
//             x: nativeEvent.absoluteX - firstTouch.current.x,
//             y: nativeEvent.absoluteY - firstTouch.current.y,
//           });
//         }}>
//         <Animated.View
//           onLayout={event => {
//             setHeight(event.nativeEvent.layout.height);
//           }}
//           style={{
//             width: '100%',
//             transform: [
//               {
//                 translateX: animatedXY.x,
//               },
//               {
//                 translateY: animatedXY.y,
//               },
//             ],
//             position: 'absolute',
//           }}>
//           {props.children}
//         </Animated.View>
//       </LongPressGestureHandler>
//     </View>
//   );
// };
//
// const MoveList = (props: IMoveFlatList) => {
//   const Component = props.renderItem as (props: {
//     item: any;
//     index: number;
//   }) => JSX.Element;
//   const [headerHeight, setHeaderHeight] = useState(0);
//
//   return (
//     <ScrollView style={props.style}>
//       <View
//         style={{
//           position: 'absolute',
//         }}
//         onLayout={event => {
//           setHeaderHeight(event.nativeEvent.layout.height);
//         }}>
//         {props.ListHeaderComponent as JSX.Element}
//       </View>
//       <View style={{height: headerHeight}} />
//       {props.data?.map((item, index) => (
//         <ListItem
//           key={item.date}
//           item={item}
//           index={index}
//           setData={props.setData}>
//           <Component item={item} index={index} />
//         </ListItem>
//       ))}
//     </ScrollView>
//   );
// };

const TodoTouch = ({
  todo,
  setTodo,
  item,
  index,
  slideRef,
}: {
  todo: Array<ITodos>;
  setTodo: (todos: Array<ITodos>) => void;
  item: ITodos;
  index: number;
  slideRef: MutableRefObject<number>;
}) => {
  const setXRef = useRef<ISetXRef>({
    setXValue: (_: number) => {},
  });

  return (
    <>
      <SlideView
        MainView={
          <TodoView
            activeOpacity={1}
            onPress={() => {
              setXRef.current.animateXValue && setXRef.current.animateXValue(0);
              if (item.complete) {
                setTodo([
                  {
                    ...item,
                    complete: !item.complete,
                  },
                  ...todo.filter((_, i) => i !== index),
                ]);
              } else {
                setTodo([
                  ...todo.filter((_, i) => i !== index),
                  {
                    ...item,
                    complete: !item.complete,
                  },
                ]);
              }
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
              setTodo(todo.filter((_: ITodos, i: number) => i !== index));
            }}>
            <DelText>삭제</DelText>
          </DelView>
        }
        slide={
          slideRef ?? {
            current: 0,
          }
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
  const slideRef = useRef<{
    [key: string]: {
      current: number;
    };
  }>({});

  useEffect(() => {
    const dict: {
      [key: string]: {
        current: number;
      };
    } = {};
    todo.forEach(s => {
      dict[String(s.date)] = {
        current: 0,
      };
    });

    slideRef.current = {
      ...dict,
      ...slideRef.current,
    };
  }, [todo]);

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
      <FlatList
        style={{
          flex: 1,
          backgroundColor: '#fff9e9',
        }}
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
        data={todo}
        renderItem={({item, index}: {item: ITodos; index: number}) => {
          return (
            <TodoTouch
              todo={todo}
              setTodo={setTodo}
              item={item}
              index={index}
              slideRef={slideRef.current[String(item.date)]}
              key={item.date}
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
