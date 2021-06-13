const cf_api_url = "https://codeforces.com/api/user.info?handles="
var parameters = new URLSearchParams(window.location.search);
const handle = parameters.get("handle");
const theme = parameters.get("theme");
const use_contributions = parameters.get("contributions") == "true" ? true : false;
const use_friends = parameters.get("friends") == "true" ? true : false;

window.onload = makeCard(handle, theme, use_contributions, use_friends)

async function makeCard(handle, theme, use_contributions, use_friends) {
	var url = cf_api_url + handle;
	const response = await fetch(url);
	const json = await response.json();
	console.log(json);
	if (json["status"] == "OK") {
		make(json["result"][0], theme, use_contributions, use_friends);
	}
}


function make(json, theme, use_contributions, use_friends) {
	var rank = document.getElementById("rank");
	rank.textContent = json["rank"];
	var handle = document.getElementById("handle");
	handle.textContent = json["handle"];
	var org = document.getElementById("org");
	org.textContent = json["organization"];
	var rating = document.getElementById("rating");
	rating.textContent = json["rating"];
	var max_rating = document.getElementById("max_rating");
	max_rating.textContent = json["maxRating"];
	if (use_contributions) {
		var contributions = document.getElementById("contributions");
		contributions.textContent = json["contributions"];
	}
	if (use_friends) {
		var friends = document.getElementById("friends");
		friends.textContent = json["friends"];
	}
}