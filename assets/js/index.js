//import "./modale"

// url API
const url = "http://localhost:8000/api/v1/titles/";

// categories
let bestMovie = document.querySelector("#bestMovie");
let bestMovies = document.querySelector("#bestMovies");
let cat1 = document.querySelector("#cat1");
let cat2 = document.querySelector("#cat2");
let cat3 = document.querySelector("#cat3");

// // attributes
// const image = document.querySelector("#image");
// const title = document.querySelector("#title");
// const genres = document.querySelector("#genres");
// const released = document.querySelector("#date_published");
// const rated = document.querySelector("#rated");
// const imdb = document.querySelector("#imdb_score");
// const directors = document.querySelector("#directors");
// const actors = document.querySelector("#actors");
// const duration = document.querySelector("#duration");
// const countries = document.querySelector("#countries");
// const boxOffice = document.querySelector("#worldwide_gross_income");
// const description = document.querySelector("#description");


showMovies();
start()

function createMoviePoster(category, movies)
{
    /*
     *
     */
    return movies.map((movie)=>
        {
        return `<div class="carousel__slide">\
        <img src=${movie.image_url} class="poster" movie-id =${movie.id} onclick="newPage(${movie.id})"/>\
        </div>`;

        })                  

}

async function getData(url, name, start, range)
{
    return  fetch(url)
            .then((res) => res.json())
            .then((data)=>
            {
                return createMoviePoster(name, data.results.slice(start, range));});


    // return new Promise((resolve, reject) =>
    // { 
    //     fetch(url)
    //         .then((res) => res.json())
    //         .then((data)=>
    //         {
    //             return data
    //             resolve(createMoviePoster(name, data.results.slice(start, range)));
    //         });
    // })
}

async function getPostersIndex(name, command)
{
    let newUrl = url + command;
    const data = await getData(newUrl, name, 0, 6)
    newUrl += "&page=2"
    const data2 = await getData(newUrl, name, 0, 2)
    const data3 = data.concat(data2);
    return data3;
    //return element;
}

// async function getImage(url){
//     /*
//      *
//      */
//     const movieElement = document.createElement("div");
//     movieElement.setAttribute("class", "image");

//     fetch(url)
//         .then((res)=>res.json())
//         .then((data)=>
//         {
//            movieElement.innerHTML = `<img src=${data["image_url"]}/>`;
//         });
//     return movieElement;
// }

// async function getDetails(url, command)
// {
//     /*
//      *
//      */
//     const movieElement = document.createElement("div");
//     movieElement.setAttribute("class", command);

//     fetch(url)
//         .then((res)=>res.json())
//         .then((data)=>
//         {
//             movieElement.innerHTML = `<p>${command} : ${data[`${command}`]}</p>`;
//         });
//     return movieElement;
// }

// function newPage(id_page)
// {
//     /*
//      *
//      */
//     window.open("page.html?"+id_page, "_top");
// }

// if (location.pathname.includes("/page.html"))
// {
//     window.onload = function()
//     {
//         /*
//          *
//          */

//         let address = document.location + "";
//         const id = address.split("?").pop();
//         const newUrl = url + id;

//         // Fetch :
//         const pageImage = getImage(newUrl);
//         const pageTitle = getDetails(newUrl, "title");
//         const pageGenres = getDetails(newUrl, "genres");
//         const pageReleased = getDetails(newUrl, "date_published");
//         const pageRated = getDetails(newUrl, "rated");
//         const pageImdb = getDetails(newUrl, "imdb_score");
//         const pageDirectors = getDetails(newUrl, "directors");
//         const pageActors = getDetails(newUrl, "actors");
//         const pageDuration = getDetails(newUrl, "duration");
//         const pageCountries = getDetails(newUrl, "countries");
//         const pageBoxOffice = getDetails(newUrl, "worldwide_gross_income");
//         const pageDescription = getDetails(newUrl, "description");

//         // AppendChild :
//         image.appendChild(pageImage);
//         title.appendChild(pageTitle);
//         genres.appendChild(pageGenres);
//         released.appendChild(pageReleased);
//         rated.appendChild(pageRated);
//         imdb.appendChild(pageImdb);
//         directors.appendChild(pageDirectors);
//         actors.appendChild(pageActors);
//         duration.appendChild(pageDuration);
//         countries.appendChild(pageCountries);
//         boxOffice.appendChild(pageBoxOffice);
//         description.appendChild(pageDescription);
//     };
// }

function showMovies()
{
    //



    // Fetch :
    let movieCatBestMovies = getPostersIndex("bestMovies", "?sort_by=-imdb_score");
    let movieCat1 = getPostersIndex("cat1", "?genre=Fantasy");
    let movieCat2 = getPostersIndex("cat2", "?genre=Drama");
    let movieCat3 = getPostersIndex("cat3", "?genre=Family");

    // Get images :
         
    // bestMovies.appendChild(movieCatBestMovies);
    // cat1.appendChild(movieCat1);
    // cat2.appendChild(movieCat2);
    // cat3.appendChild(movieCat3);

    bestMovies=movieCatBestMovies;
    cat1=movieCat1;
    cat2=movieCat2;
    cat3=movieCat3;

    const start = new CustomEvent("start");

    document.dispatchEvent(start);
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
        prevButton.addEventListener("click",this.prevSlide.bind(this));
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
        console.log(this.container.offsetWidth, translation, this.items.length)
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
    let movieCatBestMovies = await getPostersIndex("bestMovies", "?sort_by=-imdb_score");
    let movieCat1 = await getPostersIndex("cat1", "?genre=Fantasy");
    let movieCat2 = await getPostersIndex("cat2", "?genre=Drama");
    let movieCat3 = await getPostersIndex("cat3", "?genre=Family");

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