const cf_api_url = "https://codeforces.com/api/user.info?handles="
const svg_template = `
<svg xmlns="http://www.w3.org/2000/svg" class="card" width="500" height="200" viewBox="0 0 500 200" fill="none">
    <script src="index.js"></script>
    <g>
        <text id="rank" x="0" y="20" fill="black"></text>
        <text id="handle" x="0" y="50" fill="black" font-size="30px" font-family="PT Serif"></text>
        <text id="org" x="0" y="70" fill="black"></text>
    </g>
    <g>
        <text id="rating" fill="black"></text>
        <text id="max_rating" fill="black"></text>
        <text id="contributions" fill="black"></text>
        <text id="friends" fill="black"></text>
    </g>
</svg>`;

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
      <script src="index.js"></script>
      <g>
          <text id="rank" x="0" y="20" fill="black">${json["rank"]}</text>
          <text id="handle" x="0" y="50" fill="black" font-size="30px" font-family="PT Serif">${json["handle"]}</text>
          <text id="org" x="0" y="70" fill="black">${json["organization"]}</text>
      </g>
      <g>
          <text id="rating" fill="black">${json["rating"]}</text>
          <text id="max_rating" fill="black">${json["maxRating"]}</text>
          <text id="contributions" fill="black">${use_contributions ? json["contributions"] : ""}</text>
          <text id="friends" fill="black">${use_friends ? json["friends"] : ""}</text>
      </g>
  </svg>`;
    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
        },
    });
}

