import {Animated, Easing, View, ViewStyle} from 'react-native';
import React, {MutableRefObject, useEffect, useRef} from 'react';
import {PanGestureHandler} from 'react-native-gesture-handler';

export interface ISetXRef {
  setXValue?: (value: number) => void;
  animateXValue?: (value: number) => void;
}

export interface ISlideView {
  MainView: JSX.Element;
  slide: MutableRefObject<number>;
  left?: number;
  right?: number;
  rightBreak?: number;
  leftBreak?: number;
  LeftView?: JSX.Element;
  RightView?: JSX.Element;
  rootStyle?: ViewStyle;
  animationDuration?: number;
  setXRef?: MutableRefObject<ISetXRef>;
  enabled?: boolean;
}

const SlideView = ({
  MainView,
  slide,
  left,
  right,
  rightBreak,
  leftBreak,
  LeftView,
  RightView,
  rootStyle,
  animationDuration,
  setXRef,
  enabled,
}: ISlideView) => {
  const AnimationX = useRef(new Animated.Value(slide.current)).current;

  useEffect(() => {
    if (setXRef) {
      setXRef.current = {
        setXValue: value => {
          slide.current = value;

          AnimationX.setValue(value);
        },
        animateXValue: value => {
          slide.current = value;

          Animated.timing(AnimationX, {
            useNativeDriver: true,
            toValue: slide.current,
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
        enabled={enabled ?? true}
        onGestureEvent={({nativeEvent}) => {
          AnimationX.setValue(
            slide.current !== 0
              ? slide.current + nativeEvent.translationX
              : nativeEvent.translationX,
          );
        }}
        onHandlerStateChange={({nativeEvent}) => {
          if (nativeEvent.state === 5) {
            if (nativeEvent.translationX >= 0 && leftBreak) {
              slide.current =
                nativeEvent.translationX < leftBreak ? leftBreak : 0;
            } else if (rightBreak) {
              slide.current =
                nativeEvent.translationX < rightBreak * -1
                  ? rightBreak * -1
                  : 0;
            }

            Animated.timing(AnimationX, {
              useNativeDriver: true,
              toValue: slide.current,
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

export default SlideView;
