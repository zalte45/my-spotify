console.log("These are the songs we need to insert");

let currentsong = new Audio();
let ur = "http://127.0.0.1:3000/songs/";
let play = null; // play button
let songs = [];
let currentSongIndex = 0;

async function select() {
    document.querySelector(".first").addEventListener("click", async () => {
        ur = "./songs/";
        await updateSongs();
    });

    document.querySelector(".second").addEventListener("click", async () => {
        ur = "./songs1/";
        await updateSongs();
    });

    document.querySelector(".third").addEventListener("click", async () => {
        ur = "./songs2/";
        await updateSongs();
    });
}

async function getsongs() {
    let a = await fetch(ur);
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(ur)[1]);
        }
    }
    return songs;
}

function renderSongs(songsList) {
    const songul = document.querySelector(".songlist ul");
    songul.innerHTML = "";

    for (const song of songsList) {
        songul.innerHTML += `
            <li>
                <img class="invert" src="img/left-upper-img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/right-img/play.svg" alt="">
                </div>
            </li>`;
    }

    Array.from(songul.getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playmusic(songsList[index]);
            currentSongIndex = index;
        });
    });
}

async function updateSongs() {
    songs = await getsongs();
    renderSongs(songs);
    if (songs.length > 0) {
        playmusic(songs[0], true);
        currentSongIndex = 0;
    }
}

const playmusic = (track, pause = false) => {
    currentsong.src = ur + track;

    if (!pause) {
        currentsong.play();
        play.src = "img/right-img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track.replace(".mp3", ""));
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function openSidebar() {
    const sidebar = document.querySelector(".left");
    const menuBtn = document.querySelector(".menu");
    sidebar.classList.toggle("open");
    menuBtn.classList.toggle("sidebar-open");
}

function handleMenuButton() {
    const container = document.querySelector(".btn-menu");
    if (!container) return;
    if (window.innerWidth <= 600) {
        if (!document.querySelector(".menu")) {
            container.innerHTML = '<button class="menu invert" onclick="openSidebar()">☰</button>';
        }
    } else {
        container.innerHTML = "";
    }
}

window.addEventListener("load", handleMenuButton);
window.addEventListener("resize", handleMenuButton);

async function main() {
    play = document.getElementById("play");

    await updateSongs();

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/right-img/pause.svg";
        } else {
            currentsong.pause();
            play.src = "img/right-img/playbtn.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
        document.querySelector(".dot").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width);
        currentsong.currentTime = currentsong.duration * percent;
        document.querySelector(".dot").style.left = (percent * 100) + "%";
    });

    document.getElementById("next").addEventListener("click", () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        playmusic(songs[currentSongIndex]);
    });

    document.getElementById("back").addEventListener("click", () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        playmusic(songs[currentSongIndex]);
    });

    const volumeSlider = document.getElementById("volumeSlider");
    volumeSlider.value = 100;
    currentsong.volume = 1.0;
    volumeSlider.addEventListener("input", () => {
        const newVolume = volumeSlider.value / 100;
        currentsong.volume = newVolume;
        console.log("Volume changed to:", newVolume);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    select();
    main();
});


