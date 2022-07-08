import {atom, selector} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const todo_list = atom({
  key: 'todo_list',
  default: selector({
    key: 'todo_list_default',
    get: async () => {
      return JSON.parse((await AsyncStorage.getItem('todo')) ?? '[]');
    },
  }),
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        console.log('set');
        AsyncStorage.setItem('todo', JSON.stringify(newValue));
      });
    },
  ],
});
