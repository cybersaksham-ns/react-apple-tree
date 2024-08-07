import React, { createContext, useState } from "react";
import { ContextProviderProps, ReactAppleTreeProps } from "../types";
import { defaultAppleTreeProps } from "../utils/default-props";

interface PropDataContextProps {
  appleTreeProps: ReactAppleTreeProps;
  setAppleTreeProps: any;
}

const PropDataContext = createContext<PropDataContextProps>({
  appleTreeProps: defaultAppleTreeProps,
  setAppleTreeProps: () => {},
});

const PropDataContextProvider = (
  props: ContextProviderProps
): React.JSX.Element => {
  const [appleTreeProps, setAppleTreeProps] = useState<ReactAppleTreeProps>(
    defaultAppleTreeProps
  );

  return (
    <PropDataContext.Provider value={{ appleTreeProps, setAppleTreeProps }}>
      {props.children}
    </PropDataContext.Provider>
  );
};

export { PropDataContext, PropDataContextProvider };
