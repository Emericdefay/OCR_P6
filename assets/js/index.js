//import "./modale"

// url API
const url = "http://localhost:8000/api/v1/titles/";

// categories
const bestMovie = document.querySelector("#bestMovie");
const bestMovies = document.querySelector("#bestMovies");
const cat1 = document.querySelector("#cat1");
const cat2 = document.querySelector("#cat2");
const cat3 = document.querySelector("#cat3");

// attributes
const image = document.querySelector("#image");
const title = document.querySelector("#title");
const genres = document.querySelector("#genres");
const released = document.querySelector("#date_published");
const rated = document.querySelector("#rated");
const imdb = document.querySelector("#imdb_score");
const directors = document.querySelector("#directors");
const actors = document.querySelector("#actors");
const duration = document.querySelector("#duration");
const countries = document.querySelector("#countries");
const boxOffice = document.querySelector("#worldwide_gross_income");
const description = document.querySelector("#description");


class SlideShow
{
    /**
     * 
     * @param {*} element 
     * @param {*} options 
     */
    constructor(element, options = {})
    {
        this.element = element;
        this.options = Object.assign({}, 
            {
            slidesToScroll: 1,
            slidesVisible: 1
            }, options)
        //
        let children = [].slice.call(element.children);
        this.base = this.createDivWithClass("slideshow");
        this.container = this.createDivWithClass("slideshow__container");
        container.style.width = (ratio*100) +"%";
        this.base.appendChild(this.container);
        this.element.appendChild(base);
        this.items = children.map((child) => {
            let item = this.createDivWithClass("slideshow__item");
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        this.setStyle();
        this.createArrow();
    }

    setStyle()
    {

    }

    createArrow()
    {

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

showMovies();

async function getData(url, name, start, range)
{
    return new Promise((resolve, reject) =>
    { 
        fetch(url)
            .then((res) => res.json())
            .then((data)=>
            {
                resolve(createMoviePoster(name, data.results.slice(start, range)));
            });
    })
}

async function getSplitData(url1, url2, name)
{
    let memorySplit =
    {
        pageOne:"",
        pageTwo:""
    }

    return new Promise((resolve) =>
    { 
        fetch(url1)
            .then((res) => res.json())
            .then((data)=>
            {
                
                const a = createMoviePoster(name, data.results.slice(2,6));
                memorySplit.pageOne = a;
            })
            .then(
                fetch(url2)
                    .then((res) => res.json())
                    
                    .then((data)=>
                    {
                        const b = createMoviePoster(name, data.results.slice(0, 3));
                        //console.log("test.")
                        //console.log(memorySplit);
                        memorySplit.pageTwo = b;
                        console.log(memorySplit.pageTwo + memorySplit.pageOne);
                        resolve(memorySplit.pageTwo + memorySplit.pageOne);
                    }))
    })
}

function createMoviePoster(category, movies)
{
    /*
     *
     */
    return `
        ${
        movies.map((movie)=>
            {
            return `
                <img src=${movie.image_url} movie-id =${movie.id} onclick="newPage(${movie.id})"/>
                   `;
            })                  
        }
    `;
}

function getPostersIndex(name, command)
{
    /*
     *
     */
    let sliderElement = document.createElement("div");
    sliderElement.setAttribute("class", "slider");

    let movieElement = document.createElement("div");
    movieElement.setAttribute("class", "slides");
    let newUrl = url + command;

    getData(newUrl, name, 0, 5).then(data => 
    {
        let s1 = `
                    <section id="section1">
                        <a href="#section2"> < </a>
                            ${data}
                        <a href="#section2"> > </a>
                    </section>
                 `;
        movieElement.innerHTML = s1;
        sliderElement.appendChild(movieElement);
        
    })
    
    //let memorySplit;
    
    //getSplitData(newUrl, newUrl + "&page=2", name).then(data =>
    getData(newUrl+"&page=2", name, 0, 5).then(data => 
    {
        console.log("undef?");
        console.log(data);
        let s2 = `
        <section id="section2">
            <a href="#section1"> < </a>
                ${data}
            <a href="#section1"> > </a>
        </section>
        `;
    movieElement.innerHTML += s2;
    //sliderElement.appendChild(movieElement); 
    })
       
    

    return sliderElement;
}

async function getImage(url){
    /*
     *
     */
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "image");

    fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
           movieElement.innerHTML = `<img src=${data["image_url"]}/>`;
        });
    return movieElement;
}

async function getDetails(url, command)
{
    /*
     *
     */
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", command);

    fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
            movieElement.innerHTML = `<p>${command} : ${data[`${command}`]}</p>`;
        });
    return movieElement;
}

function newPage(id_page)
{
    /*
     *
     */
    window.open("page.html?"+id_page, "_top");
}

if (location.pathname.includes("/page.html"))
{
    window.onload = function()
    {
        /*
         *
         */

        let address = document.location + "";
        const id = address.split("?").pop();
        const newUrl = url + id;

        // Fetch :
        const pageImage = getImage(newUrl);
        const pageTitle = getDetails(newUrl, "title");
        const pageGenres = getDetails(newUrl, "genres");
        const pageReleased = getDetails(newUrl, "date_published");
        const pageRated = getDetails(newUrl, "rated");
        const pageImdb = getDetails(newUrl, "imdb_score");
        const pageDirectors = getDetails(newUrl, "directors");
        const pageActors = getDetails(newUrl, "actors");
        const pageDuration = getDetails(newUrl, "duration");
        const pageCountries = getDetails(newUrl, "countries");
        const pageBoxOffice = getDetails(newUrl, "worldwide_gross_income");
        const pageDescription = getDetails(newUrl, "description");

        // AppendChild :
        image.appendChild(pageImage);
        title.appendChild(pageTitle);
        genres.appendChild(pageGenres);
        released.appendChild(pageReleased);
        rated.appendChild(pageRated);
        imdb.appendChild(pageImdb);
        directors.appendChild(pageDirectors);
        actors.appendChild(pageActors);
        duration.appendChild(pageDuration);
        countries.appendChild(pageCountries);
        boxOffice.appendChild(pageBoxOffice);
        description.appendChild(pageDescription);
    };
}

async function showMovies()
{
    /*
        *
        */

    // Fetch :
    const movieCatBestMovies = getPostersIndex("bestMovies", "?sort_by=-imdb_score");
    const movieCat1 = getPostersIndex("cat1", "?genre=Fantasy");
    const movieCat2 = getPostersIndex("cat2", "?genre=Drama");
    const movieCat3 = getPostersIndex("cat3", "?genre=Family");

    // Get images :
    bestMovies.appendChild(movieCatBestMovies);
    cat1.appendChild(movieCat1);
    cat2.appendChild(movieCat2);
    cat3.appendChild(movieCat3);

};
