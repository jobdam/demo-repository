<!-- @format -->

# 기술 스택

## zod

스키마 선언 및 유효성 검사 라이브러리이다. typescript와 함께쓰는 이유는 typescript의 경우 컴파일 단계에서 검사하기때문에 런타임 단계에서의 타입에러는 어쩔수가 없다. 런타임 단계에선 이미 js가 동작하고 있기때문이다.

또,TypeScript는 number 타입만 입력받도록 강제하는 것은 가능하다.
하지만 원하는 문자열이나 원하는 숫자 범위를 강제하거나 number타입의 정수/실수 구분은 불가능하다.

https://zod.dev/

## react hook form + contextAPI

Redux는 전역 상태를 관리하기 때문에 불필요한 리렌더링이 발생 특히 폼 데이터처럼 자주 업데이트되는 상태에서는 성능 저하가 있을 수 있다. 그래서, react hook form 에선 contextapi로 전역 상태를 관리하고 나머지 상태는 redux에서 관리하여 분리한다.

같이쓰이면 성능최적화를 react hook form 이 해주기때문에 상태관리를 쓸때 같이쓰면 좋다.

### react hook form

리액트에서 쉽고 가볍게 폼을 다루기 위한 라이브러리. 폼 상태 관리와 유효성 검사를 빠르게 할 수 있게 도와주는 도구

https://codesandbox.io/p/sandbox/react-hook-form-get-started-smspp?file=%2Fsrc%2Findex.js

### contextAPI

React에서 전역 상태를 관리하는 간단한 방법 부모 컴포넌트에서 생성한 값을 자식 컴포넌트들이 props 없이도 접근
전역 상태관리긴한데 리렌더 자주되면 이슈발생으로 작은 프로젝트에서 상태관리에 쓰인다.

```js
// context.tsx
import { createContext, useContext } from "react";

export const ThemeContext = createContext("light");
export const useTheme = () => useContext(ThemeContext);

// App.tsx
import { ThemeContext } from "./context";

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <MyComponent />
    </ThemeContext.Provider>
  );
}

//이런식으로 하위 컴포넌트인 MyComponent 에 전달한다. 또한, 참조만 공유 해서 각 필드 email, password 같은 것들 개별적으로 관리
```

## radix ui

최소한의 구성만으로 바로 사용할수 있도록 설계된, 최소한의 스타일이 미리 적용된 컴포넌트로, 즉 기본적인 준비만되어있고 스타일을 커스텀 할수 있는 점때문에 사용을 고려하였음.

https://www.radix-ui.com/

## tanstack query

클라이언트에서 useState, redux 등에 axios 를 이용해 데이터를 가져와서 저장해서 사용해왔는데 서버 상태 관리 라이브러리로 이제는 데이터들을 가져올때 tanstack query를 통해 가져와서 관리를하게된다. 클라이언트 와 서버 데이터 상태를 분리해서 관리한다.

https://tanstack.com/

# 폴더구조

## src/components

컴포넌트들을 모아둔다.

## src/lib

api-client - axios interceptor로 요청들을 가로채 응답값 리턴

auth api + schema 들이 담겨있음 schema란 데이터의 형태 및 구조라고 할 수 있다.

```js
//scheam
const Man = z.object({
  name: z.string(),
  height: z.number(),
  age: z.number(),
  phoneNum: z.string(),
  homePhoneNum: z.string().optional(),
  isCompletedMilitaryService: z.boolean(),
});
//api
const getUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');

  return response.data;
};
```

authorization 인가

## src/types

api.ts

타입들을 모아두는 함수.

## src/utils

cn.ts

```js
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);

}

  //예시
//<div className={`btn ${isActive ? 'btn-primary' : ''}`} />

// <div className={cn('btn', isActive && 'btn-primary')} />

  // 👉 "btn btn-primary" 또는 "btn"

```

여러 CSS 클래스 이름들을 조건에 따라 조합할 수 있게 도와주는 유틸 함수

조건부로 클래스명을 다룰일이 많은데 조건부 클래스 네임을 통합할수 있도록. -> 즉, cn을 사용하면 모두가 같은 규칙을 따른다.
