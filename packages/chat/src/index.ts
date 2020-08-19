import { useEffect, useReducer, useCallback, RefObject } from 'react';
import debounce from 'lodash/debounce';

export interface propsType<T> {
  ref: RefObject<T>;
  load: (data: any) => Promise<any>;
  flag: number;
}

export interface stateType<T> {
  msgs: T[];
  page: number;
  total: number;
  mainBottom: number;
  mainContent: number;
}

const initialState: stateType<any> = {
  msgs: [],
  page: 0,
  total: 1,
  mainBottom: -1,
  mainContent: -1,
}

export type ActionType<T> = { type: 'increment'; data: T[]; page: number; total: number; } |
                            { type: 'add'; payload: T[]; } |
                            { type: 'other'; payload: Partial<stateType<T>>; } |
                            { type: 'reset'; }

function reducer<T>(state: stateType<T> = initialState, action: ActionType<T>): stateType<T> {
  switch (action.type) {
    case 'increment':
      return { ...state, msgs: [...action.data, ...state.msgs], page: action.page, total: action.total };
    case 'add':
      return { ...state, msgs: [...state.msgs, ...action.payload] };
    case 'other':
      return { ...state, ...action.payload };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export default function useChat<T extends HTMLElement = HTMLElement>(props: propsType<T>): { msgs: any[]; addMsg: (data: any[]) => void; } {
  const { ref, load, flag } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { msgs, page, total, mainBottom, mainContent } = state;

  const loadMore = async (index: number) => {
    if (index < total) {
      // 加载更多数据
      const _data = {
        page: index,
        size: 20,
      }
      const res: any = await load(_data);
      try {
        if (res.code === 200) {
          const { content, pageable } = res.data;
          if (index === 0) {
            dispatch({ type: 'other', payload: { msgs: content, page: 1, total: pageable.total_pages } });
          } else {
            dispatch({ type: 'increment', data: content, page: (index + 1), total: pageable.total_pages });
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  const handleScroll = debounce(useCallback(() => {
    if (!ref || !ref.current) return;
    const { scrollHeight, scrollTop, clientHeight } = ref.current;
    if (scrollTop === 0 && page !== 0) {
      loadMore(page);
    }
    dispatch({ type: 'other', payload: { mainContent: scrollHeight, mainBottom: (scrollHeight - scrollTop - clientHeight) } });
  }, [ref, page, total]), 200)

  const addMsg = useCallback((data: any[]) => {
    dispatch({ type: 'add', payload: data });
  }, [])

  useEffect(() => {
    if (!ref || !ref.current) {
      return () => { };
    }
    ref.current.addEventListener('scroll', handleScroll);
    return () => {
      if (ref && ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    }
  }, [handleScroll])

  useEffect(() => {
    if (flag !== 0) {
      dispatch({ type: 'reset' });
      loadMore(0);
      const ele = ref.current;
      if (ele) {
        ele.scrollTop = ele.scrollHeight;
        dispatch({ type: 'other', payload: { mainBottom: 0 } });
      }
    }
  }, [flag])

  useEffect(() => {
    const ele = ref.current;
    if (ele) {
      const { scrollHeight, scrollTop, clientHeight } = ele;
      if (mainBottom > 150 && scrollTop === 0) {
        ele.scrollTop = (scrollHeight - mainContent);
      } else if (mainBottom <= 150) {
        ele.scrollTop = ele.scrollHeight;
      }
      dispatch({ type: 'other', payload: { mainBottom: (scrollHeight - scrollTop - clientHeight) } });
    }
  }, [msgs])

  return {
    msgs,
    addMsg
  }
}