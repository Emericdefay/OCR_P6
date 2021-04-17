/**
 * 
 * 
 * 
 */

// Getting url of the API.
const url = "http://localhost:8000/api/v1/titles/?";

// Create documents from the index.html squeleton.
let bestMovie = document.querySelector("#bestMovie");
let bestMovies = document.querySelector("#bestMovies");
let cat1 = document.querySelector("#cat1");
let cat2 = document.querySelector("#cat2");
let cat3 = document.querySelector("#cat3");

start();


/**
 * Get information from a Movie Title Detail's JSON from the *OCMovies API* RESTful API.
 * 
 * Step 1:
 *      Adding a modal with all informations needed in the <div class="modal"></div>.
 * 
 * Step 2:
 *      Return a slide that will be a child of a "carousel__container" div.
 * @param {String} url : Movie Title Detail's url from the *OCMovies API* RESTful API.
 * @returns HTML <div class="carousel__slide"> Content </div>
 */
async function getInfo(url)
{
    return await fetch(url)
    .then((res)=>res.json())
    .then((data)=>
    {
        let bodyHTML = document.querySelector(".modal");
        bodyHTML.innerHTML +=
        `<div \
        id="${data.id}" \
        class="modal">\
            <div \
            class="modal__content" \
            style="background-image: url(${data.image_url});
                background-size:cover;">\
                <h1>${data.title}</h1>\
                <p>Genre : ${data.genres}</p>\
                <p>Date released : ${data.year}</p>\
                <p>Rate : ${data.votes}</p>\
                <p>IMDB Score : ${data.imdb_score}</p>\
                <p>Directors : ${data.directors}</p>\
                <p>Actors : ${data.actors}</p>\
                <p>Duration : ${data.duration} minutes</p>\
                <p>Countries : ${data.countries}</p>\
                <p>Box office : ${data.worldwide_gross_income}</p>\
                <p>Description : ${data.description}</p>\
                <a href="#${null}" class="modal__close">&times;</a>\
            </div>\
        </div>`;

        return `<div \
                class="carousel__slide">\
                    <a href="#${data.id}" \
                    data-target="#${data.id}" \
                    data-toggle="modal">
                        <img \
                        src=${data.image_url} \
                        class="poster"/>\
                    </a>
                </div>`;
    })
}

/**
 * @param {JSON} movies : Movie Title List's JSONs from the *OCMovies API* RESTful API.
 * @returns An array of promises HTML divs "carousel__slide"
 */
async function createMoviePoster(movies)
{
    return await movies.map((movie)=>
        {
            return getInfo(movie.url)
            .then(data => 
            {
                return data;
            })
        })               
}

/**
 * The *OCMovies API* RESTful API give 5 objects. 
 * @param {String} url : Movie Title List's url from the *OCMovies API* RESTful API.
 * @param {Number} start : Where it starts to slice objects
 * @param {Number} range : Where it ends to slice objects
 * @returns Get "carousel__slide" divs that will be added to "carousel__container"
 */
async function getData(url, start, range)
{
    return fetch(url)
                .then((res) => res.json())
                .then((data)=> createMoviePoster(data.results.slice(start, range)))
                .then((prom)=>
                {   
                    // Fusion of multiple promises.
                    // prom: [{...}, {...}, {...}, ...]
                    return Promise.all(prom);
                });             
}

/**
 * @param {String} command : Command request on the *OCMovies API* RESTful API
 * @returns Get ALL "carousel__slide" divs needed. Ready to be added to "carousel__container"
 */
async function getPostersIndex(command)
{
    let newUrl = url + command;
    const data = await getData(newUrl, 0, 6);

    // We want 7 movies per carousel.
    newUrl += "&page=2";
    const data2 = await getData(newUrl, 0, 2);

    return data.concat(data2);
}

/**
 * 
 * @param {JSON} movie : Movie Title Detail's JSONs from the *OCMovies API* RESTful API.
 * @returns HTML <div class="informations"> Content </div> that will be add to <div class="single-Movie"></div>
 */
function createMovieInfo(movie)
{
    // Add modal
    let bodyHTML = document.querySelector(".modal");
    bodyHTML.innerHTML +=
    `
    <div \
    id="${movie.id}" \
    class="modal">\
        <div \
        class="modal__content" \
        style="background-image: url(${movie.image_url});
                background-size:cover;">\
            <h1>${movie.title}</h1>\
            <p>Genre : ${movie.genres}</p>\
            <p>Date released : ${movie.date_published}</p>\
            <p>Rate : ${movie.rated}</p>\
            <p>IMDB Score : ${movie.imdb_score}</p>\
            <p>Directors : ${movie.directors}</p>\
            <p>Actors : ${movie.actors}</p>\
            <p>Duration : ${movie.duration} minutes</p>\
            <p>Countries : ${movie.countries}</p>\
            <p>Box office : ${movie.worldwide_gross_income}</p>\
            <p>Description : ${movie.description}</p>\
            <a href="#" class="modal__close">&times;</a>\
        </div>\
    </div>
    `;

    // <div class="informations"> Content </div>
    return `
    <div class="informations">\
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
    </div>
            `; 
}

/**
 * @param {String} url : Movie Title List's url from the *OCMovies API* RESTful API.
 * @returns Get the url of the most favorite Movie from the *OCMovies API* RESTful API.
 */
async function getUrlBestMovie(url)
{
    return  fetch(url)
            .then((res) => res.json())
            .then((data)=>
            {
                return data.results[0].url;
            });
}

/**
 * @returns HTML <div class="informations"> Content </div> that will be add to <div class="single-Movie"></div>
 */
async function getBestMoviePoster()
{
    const urlImdb = url + "&sort_by=-imdb_score";
    const urlBestMovie = await getUrlBestMovie(urlImdb);
    return fetch(urlBestMovie)
            .then((res)=>res.json())
            .then((data)=>
                {
                    return createMovieInfo(data);
                });
}

/**
 * Carousel Behavior's class.
 */
class SlideShow
{
    /**
     * 
     * @param {String} name 
     * @param {Array} listImages 
     * @param {*} options 
     */
    constructor(name, listImages, options = {})
    {
        this.slide = document.querySelector(name);
        // Default options:
        this.options = Object.assign({}, 
            {
            slidesToScroll: 1
            }, options)
        // Initials values:
        this.currentSlide = 0;
        this.items = listImages.map((x) => x);
        this.translation = 0
        this.widthMax = 440*this.items.length;
        this.widthPic = 440;

        // Transform listImages avoiding ",".
        listImages = listImages.join(" ");

        // Divisions creation:
        this.base = this.createDivWithClass("carousel");
        this.container = this.createDivWithClass("carousel__container");

        // Family creation:
        this.base.appendChild(this.container);
        this.slide.appendChild(this.base);

        // Edition:
        this.container.innerHTML = listImages;
        
        
        //Add directional arrows:
        this.createArrow();
    }

    /**
     * Creating arrows clickable to navigate through the carousel.
     */
    createArrow()
    {
        let nextButton = this.createDivWithClass("carousel__next");
        let prevButton = this.createDivWithClass("carousel__prev");
        this.base.appendChild(nextButton);
        this.base.appendChild(prevButton);
        nextButton.addEventListener("click", this.nextSlide.bind(this));
        prevButton.addEventListener("click", this.prevSlide.bind(this));
    }

    /**
     * Translate Right
     */
    nextSlide()
    {
        let zoomLevel = (window.devicePixelRatio);
        let ratio = this.widthPic - ((this.widthPic/this.items.length)*((window.innerWidth*zoomLevel)/this.widthMax));
        let numberSlideVisible = window.innerWidth/this.widthPic

        let pas = -this.translation/ratio
        let positionSlide = pas + numberSlideVisible;
        
        if ( positionSlide < this.items.length+1.05)
        {
            this.translate(this.currentSlide + 1);
        }
    }

    /**
     * Translate Left
     */
    prevSlide()
    {
        if (this.currentSlide > 0)
        {
            this.translate(this.currentSlide - 1); 
        }
    }

    /**
     * Use a transform: translate() style method on the container to translate all items.
     * @param {Number} index : Reference to a position
     */
    translate(index)
    {
        let zoomLevel = (window.devicePixelRatio);
        let ratio = this.widthPic - ((this.widthPic/this.items.length)*((window.innerWidth*zoomLevel)/this.widthMax));
        this.translation = -index*ratio;
        this.container.style.transform = "translate("+this.translation+"px, 0px)";
        this.currentSlide = index;
    }

    /**
     * Snippet to create <div> with a class
     * @param {string} className : Name of the class for the div
     * @returns {HTMLElement}
     */
    createDivWithClass(className)
    {
        let div = document.createElement('div');
        div.setAttribute("class", className);
        return div;
    }
}

/**
 * Starting the process.
 */
async function start()
{
    // Single movie Doc:
    let movieBest = await getBestMoviePoster();
    bestMovie.innerHTML = movieBest;

    // Categories Doc:
    let movieCatBestMovies = await getPostersIndex("&sort_by=-imdb_score");
    let movieCat1 = await getPostersIndex("&genre=Fantasy");
    let movieCat2 = await getPostersIndex("&genre=Drama");
    let movieCat3 = await getPostersIndex("&genre=Family");

    // Carousels:
    createSlider("#bestMovies", movieCatBestMovies);
    createSlider("#cat1", movieCat1);
    createSlider("#cat2", movieCat2);
    createSlider("#cat3", movieCat3);
}

/**
 * 
 * @param {String} name : Name of the SQUELETON category.
 * @param {Array} listPictures : List of HTML pictures that belong to category.
 */
async function createSlider(name, listPictures){
    new SlideShow(name, listPictures,
    {
        slidesToScroll: 1
    })
}
