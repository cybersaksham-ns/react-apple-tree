import React, { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    appleTreeProps.onChange(appleTreeProps.treeData);
  }, [appleTreeProps.treeData]);

  useEffect(() => {
    if (appleTreeProps.searchQuery && appleTreeProps.searchMethod) {
      // appleTreeProps.searchMethod({})
    }
  }, [appleTreeProps.searchQuery]);

  return (
    <PropDataContext.Provider
      value={{
        appleTreeProps,
        setAppleTreeProps: (props: ReactAppleTreeProps) => {
          setAppleTreeProps({ ...appleTreeProps, ...props });
        },
      }}
    >
      {props.children}
    </PropDataContext.Provider>
  );
};

export { PropDataContext, PropDataContextProvider };
