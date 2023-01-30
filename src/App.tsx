import { useEffect } from "react"
import { addPageAsync } from "./store/reducers/charactersPages";
import { useSelector, useDispatch } from 'react-redux'
import { selectCharactersPages, selectFetcherStatus } from "./store";

function App() {
  const charactersPages = useSelector(selectCharactersPages);
  const fetcherStatus = useSelector(selectFetcherStatus);
  const dispatch = useDispatch<any>();
  
  useEffect(() => {
    dispatch(addPageAsync(1));
  }, []);
  
  return (
    <div className="App">
      <div>{fetcherStatus.status}</div>
      {JSON.stringify(charactersPages)}
    </div>
  )
}

export default App
