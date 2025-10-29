import React, { useEffect, useRef, useState } from "react"; //렌더링마다 특정 동작, 상태관리
import { useParams, Link, useNavigate } from "react-router-dom"; //useParams: url에서 id같은 동적 파라미터,useLocation:?page=3같은 쿼리스트링은 이걸로
//Link : a같은 태그 눌렀을 때 다른 페이지로 이동할 수 있게 해주는 리액트 라우터 전용 링크
import axios from "axios"; //http 

const BoardDetail = () => {
  // 게시글 변수
  const { id } = useParams(); // useParam(): url에 포함된 동적 부분을 객체로 반환
  const [post, setPost] = useState(null); //[데이터, 상태갱신] , 처음엔 null
  const navigate = useNavigate(); //페이지 이동

  //댓글 변수 
  const [comments, setComments] = useState([]); // 댓글 목록, 목록 세팅
  const [newComment, setNewComment] = useState(""); // 새 댓글, 새댓글 세팅
  const commentRef = useRef();
  const [editingContent, setEditingContent] = useState(""); // 댓글 수정 내용
  const [editingCommentId, setEditingCommentId] = useState(null); // 어떤 댓글을 수정 중인지

  //게시물 자세히 보기(첫렌더링,id바뀔때마다) => 게시글 데이터가져옴
  useEffect(() => {
    axios.get(`http://localhost:8080/api/posts/${id}`) //axios.get(): 백엔드 api 호출
      .then(response => setPost(response.data)) //성공시 response.data 를 setPost()로 저장
      .catch(error => console.error(error)); //실패시 콘솔에 에러메시지
  }, [id]);

  //댓글 목록 불러오는 기능만
  const fetchComments = ()=>{
    axios.get(`http://localhost:8080/api/comments/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  };
  //언제 실행할지
  useEffect(() => {
    fetchComments();
  }, [id]);

  //Hook은 다 if문 위에 있어야돼!!
  //게시글 없으면 로딩중 뜸
  if (!post) return <div>로딩 중...</div>;

  //게시글 삭제
  const handleDelete = async () => { //삭제 버튼 
    const confirmDelete = window.confirm("진짜 삭제하시겠습니까?");
    if (!confirmDelete) return; // 아니오 선택 시 종료

    try { //await: 비동기함수(async안에서만) 응답올때까지 다음줄 실행멈춤
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      alert("삭제되었습니다.");
      navigate("/"); // 삭제 후 목록 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  //댓글 작성
  const handleCommentSubmit=async()=>{
    if(!newComment.trim()){
      alert("댓글을 입력해주세요.");
      commentRef.current.focus();
      return;
    }
    try{ //await: 비동기함수(async안에서만) 응답올때까지 다음줄 실행멈춤
      await axios.post(`http://localhost:8080/api/comments/${id}`, {
        content: newComment //comment객체의 필드이름 : 사용자가 입력한 문자열 value값
      });
      setNewComment(""); // 입력칸 비우기
      fetchComments(); // 새 댓글 목록 다시 불러오기
    } catch (err) {
      console.error(err);
    }
  }

  //댓글 삭제
  const handleDeleteComment =async(commentId)=>{
    if(!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try{
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      fetchComments(); //댓글 목록 불러오는 기능, 삭제 된거 바로 갱신인거지
    } catch (err) {
      console.error(err);
    }
  };

  //댓글 수정 시작
  const startEditing=(comment)=>{
    setEditingCommentId(comment.id); //이 댓글이 수정중임을 react에 알린다
    setEditingContent(comment.content);
    //수정버튼 누른 댓글이 인풋필드로 바뀌고 기존내용 입력되어있음
  }

  //댓글 수정 저장
  const saveEdit = async (commentId) => {
  if (!editingContent.trim()) return alert("댓글 내용을 입력해주세요.");
  try {        //백엔드api호출-> 스프링부트 @PutMapping("/{commentId}") 함수 호출, 가능한 이유는 id다달라서
    await axios.put(`http://localhost:8080/api/comments/${commentId}`, { content: editingContent }); //필드: 수정한 내용
    setEditingCommentId(null);  // 수정모드 종료
    setEditingContent(""); //상태 초기화
    fetchComments();
  } catch (err) {
    console.error(err);
  }
};


  return (
    /* 게시글 상세보기 */
    <div> 
      <h2>게시글 상세보기</h2>
      <p><b>ID:</b> {post.id}</p>
      <p><b>제목:</b> {post.title}</p>
      <p><b>작성자:</b> {post.author}</p>
      <p><b>내용:</b> {post.content}</p>
      <p><b>작성일:</b> {new Date(post.createdAt).toLocaleString()}</p>
      <button onClick={() => navigate(`/board/edit/${post.id}`)}>수정</button>
      <Link to="/">목록으로</Link>
      <button onClick={handleDelete}>삭제</button>

      <hr />

      {/* 댓글 영역 */}
      <div>
        <textarea ref={commentRef} placeholder="댓글을 입력하세요" value={newComment} onChange={(e) => setNewComment(e.target.value)} row={3} />
        <button onClick={handleCommentSubmit}>댓글 작성</button>
      </div>

      <ul> {/* 위에 useState했던 그 comments */}
        {comments.map((comment)=>(
          <li key={comment.id}>
            {editingCommentId===comment.id?( //수정시작한 댓글의 id랑 일치하는 id라면
              <> {/* 댓글 수정 */}
                <input value={editingContent} onChange={(e)=>setEditingContent(e.target.value)}/>
                <button onClick={() => saveEdit(comment.id)}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </>
            ):( //나머지는 그냥 띄우기
              <>  
                <p>{comment.content}</p>
                <small>댓글번호: {comment.id} | 작성일: {new Date(comment.createdAt).toLocaleString()}</small>
                <button onClick={() => startEditing(comment)}>수정</button>
                <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardDetail;
