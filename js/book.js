async function getUserByToken(token) {
    try {
      const res = await axios.get('https://api.marktube.tv/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log('getUserByToken error', error);
      return null;
    }
}

async function logout(event) {
    event.preventDefault();
    event.stopPropagation();

    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }

    try {
        await axios.delete('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        localStorage.clear();
        location.assign('/login');
    } catch (error) {
        console.log('Logout Error', error);
        alert("Log out Error!");
    }


}


async function deleteBook(bookId) {
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }
    try {
        const res = await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    } catch (error) {
        console.log("Delete Book Error", error);
        alert("Delete Book Error !");
    }

}

async function getBooks(bookId) {
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }

    try {
        const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("get Book Error", error);
        alert('get Book Error!');
    }

}

function getToken() {
    return localStorage.getItem('token');
}

async function bindLogoutButton() {
    const logoutBtn = document.querySelector('#btn_logout');
    logoutBtn.addEventListener('click', logout);
}



function render(book) {
    const detailEL = document.querySelector('#detail');

    detailEL.innerHTML = `<div class="card bg-light w-100">
    <div class="card-header"><h4>${book.title}</h4></div>
    <div class="card-body">
      <h5 class="card-title">"${book.message}"</h5>
      <p class="card-text">글쓴이 : ${book.author}</p>
      <p class="card-text">링크 : <a href="${
        book.url
      }" target="_BLANK">바로 가기</a></p>
      <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
      <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
    </div>
    <div class="card-footer">
        <small class="text-muted">작성일 : ${new Date(
          book.createdAt,
        ).toLocaleString()}</small>
      </div>
  </div>`;

    document.querySelector('#btn-delete').addEventListener('click', async () => {
        try {
            await deleteBook(book.bookId);
            location.href = '/';
        } catch (error) {
            console.log(error);
        }
    });

}

async function main() {
    // 버튼의 이벤트 추가
    bindLogoutButton();

    // 브라우저에서 id 가져오기.
    const bookId = new URL(location.href).searchParams.get('id');

    // 토큰 Check
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }

    // 토큰으로 서버에서 유저정보 가져오기.
    const user = getUserByToken(token);
    if(user === null) {
        location.assign('/login');
        return;
    }

    // 책을 서버에서 받아오기.
    const book = await getBooks(bookId);

    //받아온 책을 그리기
    render(book);

}


document.addEventListener('DOMContentLoaded', main);