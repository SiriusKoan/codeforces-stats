const cf_api_url = "https://codeforces.com/api/user.info?handles="

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
    let theme = parameters.get("theme");
    let use_contributions = parameters.get("contributions") == "true" ? true : false;
    let use_friends = parameters.get("friends") == "true" ? true : false;
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
    <svg xmlns="http://www.w3.org/2000/svg" class="card" width="500" height="200" viewBox="0 0 500 200" fill="none">
        <defs>
            <style type="text/css">
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400amp;&display=swap');

                text {
                    font-family: Oswald;
                }
            </style>
        </defs>
        <script src="index.js"></script>
        <g>
            <text id="rank" x="30" y="40" fill="black" font-size="20px">${json["rank"]}</text>
            <text id="handle" x="30" y="85" fill="black" font-size="30px">${json["handle"]}</text>
            <text id="org" x="30" y="170" fill="black" font-size="15px">${json["organization"]}</text>
        </g>
        <g>
            <text id="rating" x="300" y="50" fill="black" font-size="20px">Current Rating: ${json["rating"]}</text>
            <text id="max_rating" x="300" y="85" fill="black" font-size="17px">Max Rating: ${json["maxRating"]}</text>
            <text id="contributions" x="300" y="150" fill="black" font-size="15px">${use_contributions ? "Contributions: " +
                json["contribution"] : ""}</text>
            <text id="friends" x="300" y="180" fill="black" font-size="15px">${use_friends ? "Friends: " + json["friendOfCount"] :
                ""}</text>
        </g>
    </svg>`;
    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
        },
    });
}

