import { useEffect, useRef, useState } from "react"; //렌더링 조건마다, 상태변화
import { useNavigate, useParams } from "react-router-dom"; //페이지이동, id값가져옴
import axios from "axios"; //백엔드랑 http통신

const BoardEdit = () => {
    const { id } = useParams(); // url에서 가져온 게시글 고유번호
    const navigate = useNavigate(); //페이지 이동하려구
    
    const [title, setTitle] = useState(""); //제목 값, 변화
    const [author, setAuthor] = useState(""); //작성자 값, 변화
    const [content, setContent] = useState(""); //내용 값, 변화

    const titleRef = useRef(); //요소에 직접 닿게하려고 focus() 쓸거임
    const authorRef = useRef();
    const contentRef = useRef();

    // 기존 글 데이터 불러오기
    useEffect(() => {
        axios.get(`http://localhost:8080/api/posts/${id}`) //id로 백엔드 특정 게시글 데이터 요청
        .then(res => {  //성공 시
            const post = res.data; //res:응답 객체, res.data: 응답 데이터(JSON)
            setTitle(post.title); //상태변화
            setAuthor(post.author);
            setContent(post.content);
        })
        .catch(err => console.error(err));
    }, [id]);

    const handleUpdate = async (e) => { // 저장 버튼 (수정 다했을 때)
        e.preventDefault(); // 새로 고침 방지
        console.log("handleUpdate 호출됨"); 

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

        try {
        await axios.put(`http://localhost:8080/api/posts/${id}`, { //axios.put: 수정 요청
            title,
            author,
            content
        });
        alert("수정 완료!"); //성공 시 "수정 완료" 띄움
        navigate(`/board/${id}`); // 수정 후 상세보기로 이동
        } catch (err) { //실패 시 콘솔에 실패 요인 띄움
        console.error(err);
        }
    };

    

    return (
        <div>
        <h2>글 수정</h2>
        <form onSubmit={handleUpdate}>
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
            <button type="submit">저장</button>
            <button type="button" onClick={() => navigate(-1)}>취소</button>
        </form>
        </div>
    );
};

export default BoardEdit;
