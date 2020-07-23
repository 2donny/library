async function getUserByToken(token) {
    try {
        const res = await axios.get('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data; //토큰에 매핑되는 유저의 정보가 담겨있다.
    } catch (error) {
        console.log("getUserByToken error", error);
        return null;
    }
}

async function save(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('was-validated'); // 부트스트랩에서 정의한 클래스. Input을 전부 입력했을 때.

    const titleEL = document.querySelector('#title');
    const messageEL = document.querySelector('#message');
    const authorEL = document.querySelector('#author');
    const urlEL = document.querySelector('#url');

    const title = titleEL.value;
    const message = messageEL.value;
    const author = authorEL.value;
    const url = urlEL.value;

    if (title === '' || author === '' || message === '' || url === '') { //최소한의 입력은 클라이언트에서 받는다.
        return null;
    }


    const token = getToken(); //항상 토큰 체크
    if (token === null) {
        localStorage.clear();
        location.assign('/login');
        return;
    }

    try {
        const res = await axios.post(
            'https://api.marktube.tv/v1/book', {
                title,
                message,
                author,
                url,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }); //어떤 사람이 추가한 건지 확인하려면 토큰을 옵션으로 추가해야한다.
        location.assign('/');
    } catch (error) {
        console.log("save Error", error);
        alert('책 추가 실패');
    }


}

function getToken() {
    return localStorage.getItem('token')
}

function bindSaveButton() {
    const form = document.querySelector('#form-add-book');
    form.addEventListener('submit', save);
}

async function main() {
    //버튼에 이벤트를 연결 . 우리의 초점은 save 버튼임.
    bindSaveButton();

    //토큰 체크 (토큰이 없거나 만료되었으면, 로그인 페이지로 이동)
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return null; //리턴을 해줘야 밑의 코드까지 안감.
    }

    //토큰으로 서버에서 나의 정보를 가져오기 => 토큰이 유효한지 체크하기 위해!
    const user = await getUserByToken(token); //여기서 await 안해주면, user가 제대로 비동기처리 안된 상태에서 밑으로 가기때문에, user는 그냥 Promise 상태일 것임.
    if (user === null) {
        localStorage.clear();
        location.assign('/login');
        return null; // 문제가 있으면 항상 Null 리턴하는 습관.
    }
}


document.addEventListener('DOMContentLoaded', main);