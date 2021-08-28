let movies;
let filteredMovies = [];

const searchFilm = () => {
    const searchQuery = document.querySelector('.search-input').value
    filteredMovies = movies.filter(el => el.title.includes(searchQuery))
    getData()
}

const getData = async (page) => {
    const genreName = localStorage.getItem('genre-name') ?? null
    genre = genreName ? `&genre=${genreName}` : ''
    document.querySelector('.movies-list').innerHTML = '';
    document.querySelector('.lds-default').style.display = 'inline-block'
    document.querySelector('.pagination').style.display = 'none'
   
    fetch(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${page}${genre}`)
        .then((response) => response.json())
        .then(result => {
            let pagesCount = result.data.movie_count / result.data.limit
            pageButtons(pagesCount)
            movies = result.data.movies
            if(filteredMovies.length){
                if(filteredMovies.length === 1){ 
                    filteredMovies.map(movie => {
                        document.querySelector('.movies-list').appendChild(movieCard(movie.title_english, movie.large_cover_image, movie.description_full, movie.genres, movie.rating, movie.date_uploaded, movie.language, movie.year, movie.title, movie.id))
                    })
                    document.querySelector('.pagination').style.display = 'none'
                    document.querySelector('.card').classList.add('new')
                }
                else{
                    filteredMovies.map(movie => {
                    document.querySelector('.movies-list').appendChild(movieCard(movie.title_english, movie.large_cover_image, movie.description_full, movie.genres, movie.rating, movie.date_uploaded, movie.language, movie.year, movie.title, movie.id))
                    })
                }
            }else{ 
                movies.map(movie => {
                document.querySelector('.movies-list').appendChild(movieCard(movie.title_english, movie.large_cover_image, movie.description_full, movie.genres, movie.rating, movie.date_uploaded, movie.language, movie.year, movie.title, movie.id))
                })
                document.querySelector('.pagination').style.display = 'flex'
            }
            movies.map(movie =>{
                document.querySelector('.obj-name').appendChild(movieName(movie.title))
            })
            document.querySelector('.lds-default').style.display = 'none'
            document.querySelector('.menu-line').style.display = 'flex'
            page === 1 ? document.querySelector('.first-page').style.display = 'none' : document.querySelector('.first-page').style.display = 'block'
            page === Math.ceil( result.data.movie_count / result.data.limit) - 1 ? document.querySelector('.last-page').style.display = 'none' : document.querySelector('.last-page').style.display = 'block'
            
            document.querySelector('.first-page').onclick = () => {
                document.querySelectorAll('.pagination .pages .btn-list .page')[0].click()
            }
            document.querySelector('.last-page').onclick = () => {
                document.querySelectorAll('.pagination .pages .btn-list .page:last-child')[0].click()
                document.querySelector('.btn-list').style.transform = `translateX(${(document.querySelectorAll('.btn-list .page:last-child')[0].innerText) * (-64.7)}px)`
            }
            searchByTitle()
        })
}
getData(1)

const movieName = (title) => {
    let names = document.createElement('div')
    names.setAttribute('class', 'titles')
    let nameList = `
        <span>${title}</span>
    `
    names.innerHTML = nameList

    return names
}

document.querySelector('.search-input').oninput = function () {
    document.querySelector('.obj-name').style.display = 'flex'
    let val = this.value.trim()
    let searchItems = document.querySelectorAll('.titles span')
    if ( val !== '' ){
        searchItems.forEach(element => {
            element.innerText.search(val) === -1 ? element.classList.add('hide') :  element.classList.remove('hide')
        })
    }
    else{
        searchItems.forEach(element => {
            element.classList.remove('hide')
        })
        document.location.reload()
    }
}

document.onclick = (event) => {
    event.stopPropagation()
    document.querySelector('.obj-name').style.display === 'flex' ? document.querySelector('.obj-name').style.display = 'none' : null
}

const searchByTitle = () => {
    let moviesTitle = [...movies]
    document.querySelectorAll('.titles span').forEach((el) =>{
        el.onclick = (event) => {
            document.querySelector('.movies-list').innerHTML = '';
            document.querySelector('.lds-default').style.display = 'none'
            document.querySelector('.obj-name').style.display = 'none'
            document.querySelector('.pagination').style.display = 'none'
            moviesTitle = moviesTitle.filter(el => el.title.includes( event.target.innerText))
            moviesTitle.map(movie => {
                document.querySelector('.movies-list').appendChild(movieCard(movie.title_english, movie.large_cover_image, movie.description_full, movie.genres, movie.rating, movie.date_uploaded, movie.language, movie.year, movie.title, movie.id))
            })
            document.querySelector('.card').classList.add('new')
        }
    })
}

var input = document.querySelector('.search-input');
input.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector('.search-btn').click();
  }
});

const movieCard = (title, img, description, genre, rating, upload, language,  year, originalTitle,id) => {
    let movie = document.createElement('div')
    movie.setAttribute('class', 'card')
    let movieContent = `
    <h2>${title}</h2>
    <div class='main-content'>
        <div class='image' style='background-image: url(${img})'>
            <div class='covering'>
            <button onclick='newPage(event)' id = '${id}'>View more</button>
            </div>
        </div>
        <div class='info'>
            <span><b>Original title:</b>  ${originalTitle}</span>
            <span><b>Uploaded at:</b>  ${upload}</span>
            <span><b>Language:</b>  ${language}</span>
            <span><b>Genres:</b>  ${genre}</span>
            <span><b>Year:</b>  ${year}</span>
            <div class='rating'></div>
        </div>
    </div>
    <div class='min-text'>
        <span>${description}</span>
    <div>
    
    `
    movie.innerHTML = movieContent
    ratings(movie.children[1].children[1].children[5], rating)

    return movie
}

const ratings = (rBlock, rating) => {
    for (let i = 0; i < Math.ceil(rating); i++) {
        let item = document.createElement('span')
        item.innerText = '★'
        rBlock.appendChild(item)
    }
    for (let i = 0; i < 10 - Math.ceil(rating); i++) {
        let item = document.createElement('span')
        item.innerText = '☆'
        rBlock.appendChild(item)
    }
}

const pageButtons = (allMovies) => {
    for (let i = 1; i < allMovies; i++) {
        let buttonsBlock = document.createElement('button')
        buttonsBlock.setAttribute('class', 'page')
        buttonsBlock.innerText = i;
        document.querySelector('.btn-list').appendChild(buttonsBlock)
        buttonsBlock.onclick = () => {
            getData(+buttonsBlock.innerText)
            let chunk = -66
            let btnList = document.querySelectorAll('button')
            document.querySelectorAll('.page').forEach(e => e.classList.remove('active'))
            buttonsBlock.classList.add('active')
            if (i !== btnList.length - 1) {
                document.querySelector('.btn-list').style.transform = `translateX(${(i - 2) * chunk}px)`
                document.querySelector('.obj-name').style.display = 'flex' ? document.querySelector('.obj-name').style.display = 'none' : ''
            } else {
                document.querySelector('.btn-list').style.transform = `translateX(66px)`
                i = 0
            }
        }
    }
}

const newPage = (event) => {
    document.querySelector('.movies-list').innerHTML = ''
    document.querySelector('.lds-default').style.display = 'inline-block'
    document.querySelector('.pagination').style.display = 'none'

    const getDetails = async (query) => {   
        fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${query}`)
        .then((response) => response.json())
        .then(result => {
            movies = result.data.movie
            document.querySelector('.main').appendChild(movieBlock(movies.title_english, movies.large_cover_image, movies.url, movies.description_full ? movies.description_full : "No description", movies.genres, movies.rating, movies.date_uploaded, movies.language, movies.runtime, movies.year, movies.title, movies.id))
        })

        document.querySelector('.lds-default').style.display = 'none'
        document.querySelector('.menu-line').style.display = 'none'
    }

    const movieBlock  = (title, img, link, description, genre, rating, upload, language, runtime, year, originalTitle, id) => {
        let movie = document.createElement('div')
        movie.setAttribute('class', 'movie-card')
        let movieWatch = `
        <div class = 'title-part'>
            <h2>${title}</h2>
            <button onclick = 'backToPage()'>✗</button>
        </div>
        <div class='main-container'>
            <div class='film-block'>
                <div class='image-cover' style='background-image: url(${img})'></div>
                <div class='info-about-film'>
                    <span><b>Original title:</b>  ${originalTitle}</span>
                    <span><b>Uploaded at:</b>  ${upload}</span>
                    <span><b>Language:</b>  ${language}</span>
                    <span><b>Genres:</b>  ${genre}</span>
                    <span><b>Runtime:</b>  ${runtime}</span>
                    <span><b>Year:</b>  ${year}</span>
                    <span><b>Watch:</b>  ${link}</span>
                    <div class='rates'></div>
                    <div class='description'>${description}</div>
                </div>
            </div>
            <div class='comments-block'>
                <h2>Comments</h2>
                    <textarea class='type-coms' placeholder='Comment ...'></textarea>
                    <button  class='add-btn' onclick = 'newCom(event)'>Add comment</button>
                    <div id='${id}' class='comments-space'></div>
            </div>
        </div>
        `

        movie.innerHTML = movieWatch
        ratings(movie.children[1].children[0].children[1].children[7], rating)
        setTimeout(()=>{
            commentsList()
        })

        return movie
    }
    getDetails(event.target.id)
}

const backToPage = () => {
    document.location.reload()
}

let writeComments;
const timer = setInterval(() => {
    if(document.querySelector('.comments-space')){
        clearInterval(timer)
        writeComments = localStorage.getItem(`movie_${document.querySelector('.comments-space').id}`) ? JSON.parse(localStorage.getItem(`movie_${document.querySelector('.comments-space').id}`)) : [];
    }
})

const newCom = (event) => {
    event.preventDefault()
    if(event.target.previousElementSibling.value){

        writeComments.push({ text: event.target.previousElementSibling.value, id: Date.now()})
        localStorage.setItem(`movie_${document.querySelector('.comments-space').id}`, JSON.stringify(writeComments))
        //console.log(writeComments);
        commentsList()
        event.target.previousElementSibling.value = ''
    }
}

const commentsList = () => {
    document.querySelector('.comments-space').innerHTML = ''

    writeComments.map((element) => {
        var comsBlock = document.createElement('div')
        comsBlock.innerHTML = `
        <span data-id=${element.id}>${element.text}</span>
        <button class="btn" onclick='removeCom(event)'>✗</button>
        `
        document.querySelector('.comments-space').appendChild(comsBlock)
    })
}

const removeCom = (event) => {
    writeComments = writeComments.filter((element) => +event.target.previousElementSibling.dataset.id !== +element.id)
    //console.log(writeComments);
    event.target.parentNode.parentNode.removeChild(event.target.parentNode)
    localStorage.removeItem(`movie_${document.querySelector('.comments-space').id}`, JSON.stringify(writeComments))
}

const openGenres = () => {
    document.querySelector('.genres-block').style.display = 'flex'
    document.querySelector('.down').style.display = 'none'
    document.querySelector('.up').style.display = 'flex'
}
const closeGenres = () => {
    document.querySelector('.genres-block').style.display = 'none'
    document.querySelector('.down').style.display = 'flex'
    document.querySelector('.up').style.display = 'none'
}

const getGenres = (genre) => {
    document.querySelector('.movies-list').innerHTML = '';
    document.querySelector('.lds-default').style.display = 'inline-block'
    document.querySelector('.pagination').style.display = 'none'
    document.querySelector('.menu-line').style.display = 'none'
    document.querySelector('.genres-block').style.display = 'none'
    
    fetch(`https://yts.mx/api/v2/list_movies.json?limit=50&genre=${genre}`)
        .then((response) => response.json())
        .then(result => {
            movies = result.data.movies
            movies.map(movie => {
                document.querySelector('.movies-list').appendChild(movieCard(movie.title_english, movie.large_cover_image, movie.description_full, movie.genres, movie.rating, movie.date_uploaded, movie.language, movie.year, movie.title, movie.id))
            })
            document.querySelector('.lds-default').style.display = 'none'
            document.querySelector('.pagination').style.display = 'flex'
            document.querySelector('.menu-line').style.display = 'flex'
        })
}


document.querySelectorAll('.genres-block button').forEach(element => {
    element.onclick = () => {
        getGenres(element.innerText)
        localStorage.setItem('genre-name', element.innerText)
        document.querySelector('.down').style.display = 'flex'
        document.querySelector('.up').style.display = 'none'
        
        let sameGen = document.createElement('div')
        sameGen.setAttribute('class', 'same-gen')
        let newGenDiv = `
            <button onclick='toAllMovies(event)'>${element.innerText}   ✗</button>
        ` 
        sameGen.innerHTML = newGenDiv
        document.querySelector('.genre-btn').appendChild(sameGen)
    }
})

const toAllMovies = (event) => {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode)
    localStorage.removeItem('genre-name')
    document.location.reload()
}