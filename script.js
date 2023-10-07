const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");


// api key and searching terms
const apiKey ="CRAFygQxpgRTMPWLvmdbw07ANKNTkQpM2RLellMHz3Hvv6jE3SI9h6GE";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    // converting received img to blob, creating it download link & downloading it
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(()=> alert("Failed to download image!"));
}

const showLightBox = (name, img) => {
    // showing lightbox and setting img source, name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    lightBox.classList.add("show");
    downloadImgBtn.setAttribute("data-img", img);
    document.body.style.overflow="hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow="auto";
}


const generateHTML = (images) => {
    // making list of all fetched images and adding them to the existing image wrapper
    imageWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="ui uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                <i class="uil uil-import"></i>
            </button>
        </div>
    </li>`
    ).join("");
}

const getImages = (apiURL) => {
    // fetching images by API call with authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        // loadMoreBtn.classList.add("enabled");we can use this also if any error
        loadMoreBtn.classList.remove("disabled"); 
    }).catch(() => alert("failed to load Images"));
}

const loadMoreImages = () => {
    currentPage++; // increment current page by 15 img
    // if searchTerm has some value then call api with search else call defult api
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return  searchTerm = null;
    // if key press update the current page
    if(e.key === "Enter") {
        currentPage = 10;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=${currentPage}&per_page=${perPage}`);
    }
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
