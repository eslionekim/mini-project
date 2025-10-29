import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const BoardList = () => {
  const [posts, setPosts] = useState([]);
  const navigate =useNavigate(); //이거 추가

  useEffect(() => {
    axios.get("http://localhost:8080/api/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <button onClick={()=>navigate("/board/regist")}>글 작성</button>
      {/* onClick: 클릭 시 실행할 함수 등록, ()=>화살표 함수, navigate(""):페이지 이동함수 */}
      {posts.map(post => (
        <div key={post.id}>
          <Link to={`/board/${post.id}`}>
          <span>{post.title}</span>
          </Link>
          <span>{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
};

export default BoardList;
