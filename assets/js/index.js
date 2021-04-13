// url API
const url = "http://localhost:8000/api/v1/titles/";

// categories
const bestMovie = "";
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


function createMoviePoster(category, movies){

    const template = `
    <section class="gallery">
        ${movies.map((movie)=>
            {
            return `
                <img src=${movie.image_url} movie-id =${movie.id} onclick="newPage(${movie.id})"/>
                
                   `;
            })                  
        }
    </section>
    `;
    return template;
}

function getPostersIndex(name, command){

    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", name);

    const newUrl = url + command;

    fetch(newUrl)
        .then((res) => res.json())
        .then((data)=> {movieElement.innerHTML = createMoviePoster(name, data.results);})
        .catch();
    return movieElement;
}

function getImage(url){
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "image");


    fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
           console.log(data["id"]);
           console.log(data["image_url"]);
           movieElement.innerHTML = `<img src=${data["image_url"]}/>`;
        });
    console.log(movieElement);
    return movieElement;
}

function getDetails(url, command) {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", command);

    fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
            console.log(data[command]);
            movieElement.innerHTML = `<p>${data[`${command}`]}</p>`;
        });
    return movieElement;
}

function newPage(id_page){
    window.open("page.html?"+id_page,"_top");
}

if (location.pathname.includes("/page.html")) {
    window.onload = function (){

        let address = document.location + "";
        const id = address.split("?").pop();
        const newUrl = url + id;
        console.log(newUrl);

        // Fetch :
        const pageImage = getImage(newUrl);
        const pageTitle = getDetails(newUrl, "title");
        const pageGenres = getDetails(newUrl, "genres");
        const pageReleased = getDetails(newUrl, "date_published");
        const pageRated = getDetails(newUrl,"rated");
        const pageImdb = getDetails(newUrl,"imdb_score");
        const pageDirectors = getDetails(newUrl,"directors");
        const pageActors = getDetails(newUrl,"actors");
        const pageDuration = getDetails(newUrl,"duration");
        const pageCountries = getDetails(newUrl,"countries");
        const pageBoxOffice = getDetails(newUrl,"worldwide_gross_income");
        const pageDescription = getDetails(newUrl,"description");


        console.log(pageImage);
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

if (location.pathname.includes("/index.html")){
    window.onload = function () {

        // Fetch :
        const movieCatBestMovies = getPostersIndex("bestMovies", "?sort_by=-imdb_score");
        const movieCat1 = getPostersIndex("cat1", "?genre=Fantasy");
        const movieCat2 = getPostersIndex("cat2", "?genre=Drama");
        const movieCat3 = getPostersIndex("cat3", "?genre=Family");

        // AppendChild :
        bestMovies.appendChild(movieCatBestMovies);
        cat1.appendChild(movieCat1);
        cat2.appendChild(movieCat2);
        cat3.appendChild(movieCat3);

    };
}
