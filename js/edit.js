function getToken() {
    return localStorage.getItem('token');
}

async function getBook(bookId) {
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
        })
        return res.data;
    } catch (error) {
        console.log("Get Book Error", error);
        alert("Get Book Error");
    }
}

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

async function updateBook(bookId) {
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }

    const titleEL = document.querySelector('#title'),
        title = titleEL.value;
    const messageEL = document.querySelector('#message'),
        message = messageEL.value;
    const authorEL = document.querySelector('#author'),
        author = authorEL.value;
    const urlEL = document.querySelector('#url'),
        url = urlEL.value;

    if (title === '' || message === '' || author === '' || url === '') {
        return null;
    }

    await axios.patch(`https://api.marktube.tv/v1/book/${bookId}`, {
        title,
        message,
        author,
        url,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

function render(book) {
    const titleEL = document.querySelector('#title');
    const messageEL = document.querySelector('#message');
    const authorEL = document.querySelector('#author');
    const urlEL = document.querySelector('#url');

    titleEL.value = book.title;
    messageEL.value = book.message;
    authorEL.value = book.author;
    urlEL.value = book.url;

    document.querySelector('#form-edit-book').addEventListener('submit', async event => {
        event.preventDefault();
        event.stopPropagation();
        event.target.classList.add('was-validated');

        try {
            await updateBook(book.bookId);
            location.assign(`/book?id=${book.bookId}`);
        } catch (error) {
            console.log(error);
            alert('rendering error : ', error);
        }

    });
    
    document.querySelector('#btn-cancel').addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        location.assign(`/book?id=${book.bookId}`);
    })
}

async function main() {
    //book id 가져오기
    const bookId = new URL(location.href).searchParams.get('id');

    //token check
    const token = getToken();
    if (token === null) {
        location.assign('/login');
        return;
    }

    //get user data from server using token.
    const user = await getUserByToken(token);
    if (user === null) {
        localStorage.clear('token');
        location.assign('/login');
        return;
    }

    //책을 서버로부터 가져오기
    const book = await getBook(bookId);

    //가져온 책을 그리기
    render(book);
}

document.addEventListener('DOMContentLoaded', main);