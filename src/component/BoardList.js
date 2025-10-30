import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import debounce from "lodash.debounce";

const BoardList = () => {
  //게시글 변수
  const [posts, setPosts] = useState([]);
  
  //페이징 변수
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const pageSize = 5; // 한 페이지에 보여줄 글 수

  //검색어
  const [search,setSearch]=useState(""); //검색어 상태

  //페이지 이동
  const navigate =useNavigate(); //이거 추가

  // 서버에서 게시글 가져오기
  const fetchPosts = useCallback(async (page, keyword = "") => { //pageSize는 이미 있어서
    try {
      const res = await axios.get(`http://localhost:8080/api/posts?page=${page}&size=${pageSize}${keyword ? `&search=${keyword}` : ""}`);
      //${keyword ? `&search=${keyword}` : ""} => keyword있으면 search에 넣고 없으면 아얘 공백 
      setPosts(res.data.content); //게시글 결과를 post에 저장
      setTotalPages(res.data.totalPages); //전체 페이지수도 가져오기
    } catch (err) {
      console.error(err);
    }
  }, []);
  // 검색 적용
  const debouncedFetchPosts = useCallback(
    debounce((value) => {
      fetchPosts(0, value); //위 함수(게시글 전체)를 0페이지부터 가져와
      setPage(0); //const [page, setPage] = useState(0); 현재 페이지 현재 페이지 수를 0으로
    }, 500), //500ms 지연, 타이핑치는 과정에 있는 텍스트는 무시해야 효율적
    [fetchPosts] //위 함수 호출시마다
  );
  // 검색어 입력시 호출
  const handleSearchChange = (e) => {
    const value = e.target.value; //인풋 값 가져와
    setSearch(value); //const [search,setSearch]=useState(""); search업데이트
    if(value){ //검색어가 있을때만 
      debouncedFetchPosts(value); //검색 적용
    } else {
        debouncedFetchPosts.cancel(); // 남은 debounce 취소
        fetchPosts(0);                // 전체 게시글 조회
        setPage(0);                   // 페이지 초기화
    }
  };

  //검색안할때 전체 게시글 가져오기 (페이지나 검색어 바뀔 때 실행)
  useEffect(() => { 
    if(search===""){ //검색 중이 아니라면!! 얘를 위한거임
      fetchPosts(page,search); //전체 게시글 가져오기
    }
  }, [page,fetchPosts, search]);

  const handlePrev = useCallback(() => { //이전 버튼 함수
    if (page > 0) setPage(page - 1); //page=1부터 일때만
  },[page]);

  const handleNext = useCallback(() => { //다음 버튼 함수
    if (page < totalPages - 1) setPage(page + 1); //page=전체페이지-1 까지만
  },[page,totalPages]);

  return (
    <div>
      <button onClick={()=>navigate("/board/regist")}>글 작성</button>
      {/* 검색 input */}
      <input
        type="text"
        placeholder="검색어 입력"
        value={search}
        onChange={handleSearchChange}
      />
      {/* onClick: 클릭 시 실행할 함수 등록, ()=>화살표 함수, navigate(""):페이지 이동함수 */}
      {posts.map(post => (
        <div key={post.id}>
          {/*<span>{post.id}</span>  id 보여주는 곳!!!*/} 
          <Link to={`/board/${post.id}`}>
          <span>{post.title}</span>
          </Link>
          <span>{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <p> {/* 여기 숫자 바꾸면 미리보기 글자 개수 변경 가능 */}
            {post.content.length>100?post.content.slice(0,100)+"...":post.content}
          </p>
        </div>
      ))}

      {/* 페이징 버튼 */}
      <div>
        <button onClick={handlePrev} disabled={page === 0}>이전</button> {/* page=0(보여지는건1)일때 제외 이전 페이지 이동 함수 */}
        <span>{page + 1} / {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages - 1}>다음</button> {/* 마지막 페이지 제외 다음 페이지 이동 함수 */}
      </div>
    </div>
  );
};

export default BoardList;
