import React, { createContext, useState } from "react";
import { ContextProviderProps, ReactAppleTreeProps } from "../types";

interface PropDataContextProps {
  appleTreeProps: ReactAppleTreeProps;
  setAppleTreeProps: any;
}

const PropDataContext = createContext<PropDataContextProps>({
  appleTreeProps: {
    treeData: [],
    onChange: () => {},
  },
  setAppleTreeProps: () => {},
});

const PropDataContextProvider = (
  props: ContextProviderProps
): React.JSX.Element => {
  const [appleTreeProps, setAppleTreeProps] = useState<ReactAppleTreeProps>({
    treeData: [],
    onChange: () => {},
  });

  return (
    <PropDataContext.Provider value={{ appleTreeProps, setAppleTreeProps }}>
      {props.children}
    </PropDataContext.Provider>
  );
};

export { PropDataContext, PropDataContextProvider };
