// url API
const url = "http://localhost:8000/api/v1/titles/";

// categories
let bestMovie = document.querySelector("#bestMovie");
let bestMovies = document.querySelector("#bestMovies");
let cat1 = document.querySelector("#cat1");
let cat2 = document.querySelector("#cat2");
let cat3 = document.querySelector("#cat3");

start();

function createMoviePoster(movies, parent)
{
    /*
     *
     */
    return movies.map((movie)=>
        {
        return `<div \
                class="carousel__slide">\
                    <a href="#${movie.id}" \
                    data-target="#${movie.id}" \
                    data-toggle="modal">
                        <img \
                        src=${movie.image_url} \
                        class="poster"/>\
                    </a>
                </div>
                
                <div \
                id="${movie.id}" \
                class="modal">\
                    <div \
                    class="modal__content" \
                    style="background-image: url(${movie.image_url});
                            background-size:cover;">\
                        <h1>${movie.title}</h1>\
                        <p>Genre : ${movie.genre}</p>\
                        <p>Date released : ${movie.date_published}</p>\
                        <p>Rate : "${movie.rated}"</p>\
                        <p>IMDB Score : "${movie.imdb_score}"</p>\
                        <p>Directors : "${movie.directors}"</p>\
                        <p>Actors : "${movie.actors}"</p>\
                        <p>Duration : "${movie.duration}"</p>\
                        <p>Countries : "${movie.countries}"</p>\
                        <p>Box office : "${movie.worldwide_gross_income}"</p>\
                        <p>Description : ${movie.description}</p>\
                        <a href="#${parent}" class="modal_close">&times;</a>\
                    </div>\
                </div>`;
        })                  
}

async function getData(url, start, range)
{
    return  fetch(url)
            .then((res) => res.json())
            .then((data)=>
            {
                return createMoviePoster(data.results.slice(start, range));
            });
}

async function getPostersIndex(command)
{
    let newUrl = url + command;
    const data = await getData(newUrl, 0, 6);
    newUrl += "&page=2";
    const data2 = await getData(newUrl, 0, 2);
    const data3 = data.concat(data2);
    return data3;
}

function createMovieInfo(movie)
{
    /*
     *
     */
    return `<div class="informations">\
                <a href="#${movie.id}" \
                data-target="#${movie.id}" \
                data-toggle="modal"> \
                    <img\
                    src=${movie.image_url} \
                    class="bigPoster" \
                    >\
                </a> \
                <p class="title">${movie.title}</p>\
                    <div>\
                        <p class="desc">${movie.description}</p>\
                    </div>\
            </div>\
            <div \
            id="${movie.id}" \
            class="modal">\
                <div \
                class="modal__content" \
                style="background-image: url(${movie.image_url});
                        background-size:cover;">\
                    <h1>${movie.title}</h1>\
                    <p>Genre : ${movie.genre}</p>\
                    <p>Date released : ${movie.date_published}</p>\
                    <p>Rate : "${movie.rated}"</p>\
                    <p>IMDB Score : "${movie.imdb_score}"</p>\
                    <p>Directors : "${movie.directors}"</p>\
                    <p>Actors : "${movie.actors}"</p>\
                    <p>Duration : "${movie.duration}"</p>\
                    <p>Countries : "${movie.countries}"</p>\
                    <p>Box office : "${movie.worldwide_gross_income}"</p>\
                    <p>Description : ${movie.description}</p>\
                    <a href="#" class="modal_close">&times;</a>\
                </div>\
            </div>`; 
}

async function getUrlBestMovie(url)
{
    return  fetch(url)
            .then((res) => res.json())
            .then((data)=>
            {
                console.log(data.results[0].url);
                return data.results[0].url;
            });
}

async function getBestMoviePoster()
{
    const urlImdb = url + "?sort_by=-imdb_score";
    const urlBestMovie = await getUrlBestMovie(urlImdb);
    return fetch(urlBestMovie)
            .then((res)=>res.json())
            .then((data)=>
                {
                    return createMovieInfo(data)
                });
}


class SlideShow
{
    /**
     * 
     * @param {*} element 
     * @param {*} options 
     */
    constructor(name, listImages, options = {})
    {
        this.slide = document.querySelector(name);
        // Default options:
        this.options = Object.assign({}, 
            {
            slidesToScroll: 1,
            slidesVisible: 4
            }, options)
        // Initials values
        this.currentSlide = 0;
        this.items = listImages.map((x) => x);

        listImages = listImages.join(" ");

        // Divisions creation
        this.base = this.createDivWithClass("carousel");
        this.container = this.createDivWithClass("carousel__container");

        // Family creation
        this.base.appendChild(this.container);
        this.slide.appendChild(this.base)

        this.setStyle();

        // Edition
        this.container.innerHTML = listImages;
        
        
        this.createArrow();
    }

    setStyle()
    {
        let ratio = (this.items.length / this.options.slidesVisible);
        console.log(window.innerWidth)
        this.container.style.width = (ratio * 100) + "%";
        // A voir?
        this.items.forEach((item,index) =>
            {
                let division = document.createElement("div")
                division.setAttribute("class","image")
                division.setAttribute("id",index)
                division.innerHTML = item
                this.items[index] = division
            })
    }

    createArrow()
    {
        let nextButton = this.createDivWithClass("carousel__next");
        let prevButton = this.createDivWithClass("carousel__prev");
        this.base.appendChild(nextButton);
        this.base.appendChild(prevButton);
        nextButton.addEventListener("click", this.nextSlide.bind(this));
        prevButton.addEventListener("click", this.prevSlide.bind(this));
    }

    nextSlide()
    {
        this.translate(this.currentSlide + this.options.slidesToScroll);
    }

    prevSlide()
    {
        this.translate(this.currentSlide - this.options.slidesToScroll); 
    }

    translate(index)
    {
        let translation = -0.8*index*this.options.slidesToScroll*(this.container.offsetWidth / this.items.length);
        this.container.style.translation
        this.container.style.transform = "translate3d("+translation+"px, 0px, 0px)";
        this.currentSlide = index;
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass(className)
    {
        let div = document.createElement('div');
        div.setAttribute("class", className);
        return div
    }
}

async function start()
{
    let movieBest = await getBestMoviePoster()

    bestMovie.innerHTML = movieBest;

    let movieCatBestMovies = await getPostersIndex("?sort_by=-imdb_score");
    let movieCat1 = await getPostersIndex("?genre=Fantasy");
    let movieCat2 = await getPostersIndex("?genre=Drama");
    let movieCat3 = await getPostersIndex("?genre=Family");

    document.addEventListener("start", createSlider("#bestMovies", movieCatBestMovies));
    document.addEventListener("start", createSlider("#cat1", movieCat1));
    document.addEventListener("start", createSlider("#cat2", movieCat2));
    document.addEventListener("start", createSlider("#cat3", movieCat3));
}

async function createSlider(name, listPictures){
    new SlideShow(name, listPictures,
    {
        slidesToScroll: 1,
        slidesVisible: 4
    })
}
