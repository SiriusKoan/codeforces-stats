const cf_api_url = "https://codeforces.com/api/user.info?handles="
const colors = {
    "newbie": "gray",
    "pupil": "rgb(136,204,34)",
    "apprentice": "green",
    "specialist": "rgb(3,168,158)",
    "expert": "blue",
    "candidate master": "rgb(170,0,170)",
    "master": "rgb(255,140,0)",
    "international master": "rgb(255,140,0)",
    "grandmaster": "red",
    "international grandmaster": "red",
    "legendary grandmaster": "red",
}
const theme_color = {
    "default": "svg{background-color:#fffafa}text{fill:black}",
    "dark": "svg{background-color:#3B3B3B}text{fill:white}",
}

addEventListener("fetch", (event) => {
    event.respondWith(
        makeCard(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

async function makeCard(request) {
    var parameters = new URLSearchParams(new URL(request.url).searchParams);
    let handle = parameters.get("handle");
    let use_contributions = parameters.get("contributions") == "true" ? true : false;
    let use_friends = parameters.get("friends") == "true" ? true : false;
    let theme = parameters.get("theme") ? parameters.get("theme") : "default";
    let url = cf_api_url + handle;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    if (json["status"] == "OK") {
        return make(json["result"][0], theme, use_contributions, use_friends);
    }
    else {
        return new Response("Not found", { status: 404 })
    }
}


function make(json, theme, use_contributions, use_friends) {
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200">
        <defs>
            <style type="text/css">
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&amp;display=swap');

                text {
                    font-family: Roboto Condensed;
                }

                ${theme_color[theme]}

                #rank, #handle, #rating {
                    fill: ${colors[json["rank"]]};
                }

                ${json["rank"] == "legendary grandmaster" ? "tspan{fill: black}" : ""}

                #max {
                    fill: ${colors[json["maxRank"]]};
                }
            </style>
        </defs>
        <script src="index.js"></script>
        <g>
            <text id="rank" x="30" y="40" fill="black" font-size="20px">${json["rank"]}</text>
            <text id="handle" x="30" y="85" fill="black" font-size="30px"><tspan>${json["handle"][0]}</tspan>${json["handle"].slice(1)}</text>
            <text id="org" x="30" y="170" fill="black" font-size="15px">${json["organization"]}</text>
        </g>
        <g>
            <text id="rating" x="270" y="50" fill="black" font-size="20px">Rating: ${json["rating"]}</text>
            <text id="max" x="270" y="85" fill="black" font-size="17px">Max: ${json["maxRank"]}, ${json["maxRating"]}</text>
            <text id="contributions" x="270" y="150" fill="black" font-size="15px">${use_contributions ? "Contributions: " + json["contribution"] : ""}</text>
            <text id="friends" x="270" y="180" fill="black" font-size="15px">${use_friends ? "Friends: " + json["friendOfCount"] : ""}</text>
        </g>
    </svg>`;
    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
        },
    });
}
