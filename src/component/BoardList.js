import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const BoardList = () => {
  //게시글 변수
  const [posts, setPosts] = useState([]);
  
  //페이징 변수
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const pageSize = 10; // 한 페이지에 보여줄 글 수

  //페이지 이동
  const navigate =useNavigate(); //이거 추가
  
  //한 페이지에 보여줄 10개의 글
  const fetchPosts = async (page) => { //async: 서버에서 게시글 데이터 가져오기
    try {
      const res = await axios.get(`http://localhost:8080/api/posts?page=${page}&size=${pageSize}`);//api호출
      setPosts(res.data.content); //객체의 content 가져오기
      setTotalPages(res.data.totalPages); //객체의 totalPages 가져오기
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { //페이지 변경마다 게시글 10개 함수 호출
    fetchPosts(page);
  }, [page]);

  const handlePrev = () => { //이전 버튼 함수
    if (page > 0) setPage(page - 1); //page=1부터 일때만
  };

  const handleNext = () => { //다음 버튼 함수
    if (page < totalPages - 1) setPage(page + 1); //page=전체페이지-1 까지만
  };

  return (
    <div>
      <button onClick={()=>navigate("/board/regist")}>글 작성</button>
      {/* onClick: 클릭 시 실행할 함수 등록, ()=>화살표 함수, navigate(""):페이지 이동함수 */}
      {posts.map(post => (
        <div key={post.id}>
          <span>{post.id}</span>
          <Link to={`/board/${post.id}`}>
          <span>{post.title}</span>
          </Link>
          <span>{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      ))}

      {/* 페이징 버튼 */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrev} disabled={page === 0}>이전</button>
        <span style={{ margin: "0 10px" }}>{page + 1} / {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages - 1}>다음</button>
      </div>
    </div>
  );
};

export default BoardList;
