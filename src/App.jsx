import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import NotFound from "./components/NotFound";

const ShowList = lazy(() => import("./page/ShowList"));
const Form = lazy(() => import("./page/Form"));

function App() {
  return (
    <Router>
      <Suspense fallback={"isLoading...."}>
        <Routes>
          <Route path="/" element={<ShowList />} />
          <Route path="/form" element={<Form />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
