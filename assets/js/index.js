// Getting url of the API.
const url = "http://localhost:8000/api/v1/titles/?";

// Get bones of the initial index.html
let bestMovie = document.querySelector("#bestMovie");
let bestMovies = document.querySelector("#bestMovies");
let cat1 = document.querySelector("#cat1");
let cat2 = document.querySelector("#cat2");
let cat3 = document.querySelector("#cat3");

// Start the script.
start();

/**
 * @param {String} text : The text to check
 * @returns Return "Unknown" if text is null. Else return the text. 
 */
function checkNotNull(text)
{
    if(text === null)
    {
        text = "Unknown.";
        return text;
    }

    return text;
}

/**
 * 
 * @param {Object} data : Data object to checkout.
 * @returns Return the data after checking null is replace by "Unknown."
 */
function checkData(data)
{
    // check if data are null
    data.id = checkNotNull(data.id);
    data.title = checkNotNull(data.title);
    data.genres = checkNotNull(data.genres);
    data.year = checkNotNull(data.year);
    data.votes = checkNotNull(data.votes);
    data.imdb_score = checkNotNull(data.imdb_score);
    data.directors = checkNotNull(data.directors);
    data.actors = checkNotNull(data.actors);
    data.duration = checkNotNull(data.duration);
    data.countries = checkNotNull(data.countries);
    data.worldwide_gross_income = checkNotNull(data.worldwide_gross_income);
    data.description = checkNotNull(data.description);
    data.image_url = checkNotNull(data.image_url);

    return data;
}

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
        // check if data are null
        data = checkData(data);

        let bodyHTML = document.querySelector(".modals");

        if(!document.getElementById(data.id))
        {
            bodyHTML.innerHTML += 
            `
            <div 
            id="${data.id}" 
            class="modal">
            \t<div 
            class="modal__content"
            id="${data.id}__content">
            \t\t<h1>${data.title}</h1>
            \t\t<p>Genre : ${data.genres}</p>
            \t\t<p>Date released : ${data.year}</p>
            \t\t<p>Rate : ${data.votes}</p>
            \t\t<p>IMDB Score : ${data.imdb_score}</p>
            \t\t<p>Directors : ${data.directors}</p>
            \t\t<p>Actors : ${data.actors}</p>
            \t\t<p>Duration : ${data.duration} minutes</p>
            \t\t<p>Countries : ${data.countries}</p>
            \t\t<p>Box office : ${data.worldwide_gross_income}</p>
            \t\t<p>Description : ${data.description}</p>
            \t\t<a href="#${null}" class="modal__close">&times;</a>
            \t</div>
            </div>
            `;  
        }

        //Set Image of modal__content as background
        let idContent = `${data.id}__content`;
        document.getElementById(idContent).style.backgroundImage = `url(${data.image_url})`;
        document.getElementById(idContent).style.backgroundSize = "cover";

        let slideCarousel = 
        `<div \
        class="carousel__slide">\
            <a href="#${data.id}" \
            data-target="#${data.id}" \
            data-toggle="modal">
                <img \
                src=${data.image_url} \
                class="poster"
                alt = "" \
                />\
            </a>
        </div>`;

        return slideCarousel;
    })
}

/**
 * @param {JSON} movies : Movie Title List's JSONs from the *OCMovies API* RESTful API.
 * @returns An array of promises HTML divs "carousel__slide"
 */
async function createMoviePoster(movies)
{
    return await movies.map(async (movie)=>
        {
            let data = await getInfo(movie.url);
            return data;
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
                .then((data)=> {
                                return createMoviePoster(data.results.slice(start, range));

                                })
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
async function getSlides(command)
{
    let newUrl = url + command;
    let page = "&page=1"
    const data = await getData(newUrl+page, 0, 5);

    // We want 7 movies per carousel.
    page = "&page=2";
    const data2 = await getData(newUrl+page, 0, 2);

    // Concatenate page1 & page2.
    const dataAll = data.concat(data2);

    return dataAll;
}

/**
 * Get information from a Movie Title Detail's JSON from the *OCMovies API* RESTful API.
 * 
 * Step 1:
 *      Adding a modal with all informations needed in the <div class="modal"></div>.
 * 
 * Step 2:
 *      Return information that will be a child of the "bestMovie" div.
 * 
 * @param {JSON} movie : Movie Title Detail's JSONs from the *OCMovies API* RESTful API.
 * @returns HTML <div class="informations"> Content </div> that will be add to <div class="bestMovie"></div>
 */
function createMovieInfo(movie)
{
    // check if movie data are null
    movie = checkData(movie);

    // Add modal
    let bodyHTML = document.querySelector(".modals");

    if(!document.getElementById(movie.id))
    {
        bodyHTML.innerHTML +=
        `\t<div \
        \tid="${movie.id}"
        \tclass="modal">
        \t\t<div 
        \tclass="modal__content"
        \tid="${movie.id}__content">\n
        \t\t\t<h1>${movie.title}</h1>
        \t\t\t<p>Genre : ${movie.genres}</p>
        \t\t\t<p>Date released : ${movie.date_published}</p>
        \t\t\t<p>Rate : ${movie.votes}</p>
        \t\t\t<p>IMDB Score : ${movie.imdb_score}</p>
        \t\t\t<p>Directors : ${movie.directors}</p>
        \t\t\t<p>Actors : ${movie.actors}</p>
        \t\t\t<p>Duration : ${movie.duration} minutes</p>
        \t\t\t<p>Countries : ${movie.countries}</p>
        \t\t\t<p>Box office : ${movie.worldwide_gross_income}</p>
        \t\t\t<p>Description : ${movie.description}</p>
        \t\t\t<a href="#" class="modal__close">&times;</a>
        \t\t</div>
        \t</div>\n`;
    }

    // // Set Image of modal__content as background
    modalContent = document.getElementById(`${movie.id}__content`);
    modalContent.style.backgroundImage = `url(${movie.image_url})`;
    modalContent.style.backgroundSize = "cover";

    // return <div class="informations"> Content </div>
    let firstMovie =
    `
    \t<a href="#${movie.id}" 
    data-target="#${movie.id}" 
    data-toggle="modal"> 
    \t\t\t<img
    src=${movie.image_url} 
    class="bigPoster" 
    alt = "" 
    >
    \t</a> 
    \t<p class="title">${movie.title}</p>
    \t\t<div>
    \t\t\t<p class="desc">${movie.description}</p>
    \t\t</div>`; 

    return firstMovie
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
async function getBestMovie()
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
     * Constructor
     * @param {String} name : Name of the HTML 
     * @param {Array} listSlides : 
     */
    constructor(name, listSlides)
    {
        this.slide = document.querySelector(name);

        // Initials values:
        this.currentSlide = 0;
        this.items = listSlides.map((x) => x);
        this.translation = 0
        this.widthMax = 440*this.items.length;
        this.widthPic = 440;

        // Transform listImages avoiding ",".
        listSlides = listSlides.join(" ");

        // Divisions creation:
        this.base = this.createDivWithClass("carousel");
        this.container = this.createDivWithClass("carousel__container");

        // Family creation:
        this.base.appendChild(this.container);
        this.slide.appendChild(this.base);

        // Edition:
        this.container.innerHTML = listSlides;
        
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
        // Calculs
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
    let movieBest = await getBestMovie();
    bestMovie.innerHTML = movieBest;

    // Categories Doc:
    let movieCatBestMovies = await getSlides("&sort_by=-imdb_score");
    let movieCat1 = await getSlides("&genre=Fantasy");
    let movieCat2 = await getSlides("&genre=Drama");
    let movieCat3 = await getSlides("&genre=Family");

    // Carousels:
    createSlider("#bestMovies", movieCatBestMovies);
    createSlider("#cat1", movieCat1);
    createSlider("#cat2", movieCat2);
    createSlider("#cat3", movieCat3);
}

/**
 * 
 * @param {String} name : Name of the SQUELETON category.
 * @param {Array} listSlides : List of slides that belong to category.
 */
async function createSlider(name, listSlides){
    console.log(listSlides);
    new SlideShow(name, listSlides);
}
