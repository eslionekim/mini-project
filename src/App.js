import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main";
import BoardRegist from "./component/BoardRegist";
import BoardDetail from "./component/BoardDetail";
import BoardEdit from "./component/BoardEdit";

function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> {/* Main에 BoardList호출이 있음 */}
        <Route path="/board/regist" element={<BoardRegist />} /> {/* 글 작성 */}
        <Route path="/board/:id" element={<BoardDetail />} /> {/* 상세페이지 라우트 */}
        <Route path="/board/edit/:id" element={<BoardEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
