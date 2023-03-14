import * as React from "react";
import { useGlobalContext } from 'global/GlobalProvider'

interface ITest {
}

const Test: React.FC<ITest> = (props: ITest) => {
  const { test } = useGlobalContext();
  React.useEffect(()=> {
    test()
  }, [test])
  
  return (
    <div>
      Test Page
    </div>
  )
}

export default Test;
