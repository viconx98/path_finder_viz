import classNames from "classnames"
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import VisualizerPage from "./pages/VisualizerPage"
import { setCurrentTheme } from "./slices/uiSlice"

function App() {
  const dispatch = useAppDispatch()
  const { currentTheme } = useAppSelector(state => state.ui)

  return (
    <div className={currentTheme === "dark" ? "dark" : "light"}>
      <main className="w-full min-h-screen font-poppins bg-gray-200 dark:bg-zinc-900 text-zinc-900 dark:text-gray-100">
        <VisualizerPage/>
      </main>
    </div>
  )
}

export default App
