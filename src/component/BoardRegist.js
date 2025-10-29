import {useRef, useState} from "react"; //상태 저장
import { useNavigate } from "react-router-dom"; //글 등록 후 다른 페이지로 이동
import axios from "axios"; //http요청

const BoardRegist=()=>{
    const [title,setTitle] =useState(""); //제목 입력값, 상태반영
    const [content,setContent] =useState(""); //내용 입력값, 상태반영
    const [author,setAuthor] =useState(""); //작성자 입력값 , 상태반영
    const navigate = useNavigate();

    const titleRef = useRef(); //요소에 직접 닿게하려고 focus() 쓸거임
    const authorRef = useRef();
    const contentRef = useRef();

    const handleSubmit=async(e)=>{
        e.preventDefault(); //새로고침 기본 동작 방지

        // 입력값 체크
        if (!title.trim()) {
          alert("제목을 입력해주세요."); // 하나라도 비어있으면 제출 X
          titleRef.current.focus();
          return;
        }
        else if(!author.trim()){
          alert("작성자를 입력해주세요."); // 하나라도 비어있으면 제출 X
          authorRef.current.focus();
          return;
        }

        else if(!content.trim()){
          alert("내용을 입력해주세요."); // 하나라도 비어있으면 제출 X
          contentRef.current.focus(); 
          return;
        }

        try{
            await axios.post("http://localhost:8080/api/posts",{ 
              //axios.post로 입력값을 http://localhost:8080/api/posts 주소로 보냄 -> Spring Boot의 PostController가 받게 됨
                title,
                content,
                author
            });
            navigate("/"); //전송 성공 시 게시글 목록 화면으로 돌아감
        }catch(err){
            console.error(err); //전송 실패 시 에러
        }
    };

    return (
    <div>
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input ref={titleRef} type="text" value={title} onChange={e => setTitle(e.target.value)}  />
        </div> {/* onChange로 상태 반영 */}
        <div>
          <label>작성자:</label>
          <input ref={authorRef} type="text" value={author} onChange={e => setAuthor(e.target.value)}  />
        </div>
        <div>
          <label>내용:</label>
          <textarea ref={contentRef} value={content} onChange={e => setContent(e.target.value)}  />
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default BoardRegist;