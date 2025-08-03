console.log("These are the songs we need to insert");

// Base path for your GitHub Pages site — change username/repo if needed
const BASE_URL = "https://zalte45.github.io/my-spotify/";

let currentsong = new Audio();
let play = null; // play button
let songs = [];
let currentSongIndex = 0;
let ur = "songs/";

// Hardcoded song lists for each folder
const songsData = {
    "songs/": [
        "Barse More Naina.mp3",
        "Be Free.mp3",
        "Doorun Doorun.mp3",
        "Emptiness.mp3",
        "Finding Her.mp3",
        "Ishkacha Naad.mp3",
        "Jaani.mp3",
        "NaQabil.mp3",
        "O Sajna.mp3",
        "Vaaroon.mp3"
    ],
    "songs1/": [
        "Bairiyaa.mp3",
        "Bardali.mp3",
        "CHOR BAZARI.mp3",
        "Hosana.mp3",
        "Humsafar.mp3",
        "Jeene Laga Hoon.mp3",
        "Khali Pili.mp3",
        "Main Rang Sharbaton Ka.mp3",
        "Sanjhawaan.mp3",
        "TUJHSE DOOR JO HOTA HOON.mp3",
        "gulabi-sadi.mp3"
    ],
    "songs2/": [
        "Jag Ghoomeya.mp3",
        "Love You Na Yaar.mp3",
        "Main Badhiya Tu Bhi Badhiya.mp3",
        "Maine Jana Mujh Mein Tu Hai.mp3",
        "Majja Mi Life.mp3",
        "Mera Yaar.mp3",
        "Mi Naadkhula.mp3",
        "Piya O Re Piya.mp3",
        "Sahiba.mp3"
    ]
};

// Button clicks to select folder
async function select() {
    document.querySelector(".first").addEventListener("click", async () => {
        ur = "songs/";
        await updateSongs();
    });

    document.querySelector(".second").addEventListener("click", async () => {
        ur = "songs1/";
        await updateSongs();
    });

    document.querySelector(".third").addEventListener("click", async () => {
        ur = "songs2/";
        await updateSongs();
    });
}

// Use hardcoded arrays instead of fetching directory
async function getsongs() {
    return songsData[ur];
}

function renderSongs(songsList) {
    const songul = document.querySelector(".songlist ul");
    songul.innerHTML = "";

    for (const song of songsList) {
        songul.innerHTML += `
            <li>
                <img class="invert" src="img/left-upper-img/music.svg" alt="">
                <div class="info">
                    <div>${song}</div>
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
    currentsong.src = BASE_URL + ur + encodeURIComponent(track);

    if (!pause) {
        currentsong.play();
        play.src = "img/right-img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track.replace(".mp3", "");
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
