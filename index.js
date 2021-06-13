const cf_api_url = "https://codeforces.com/api/user.info?handles="

window.onload = makeCard(window.location.search)


function makeCard(query) {
	var parameters = new URLSearchParams(query);
	var handle = parameters.get("handle");
	var theme = parameters.get("theme");
	var data = fetchData(handle);
	console.log(data)
}

async function fetchData(handle) {
	var url = cf_api_url + handle;
	const response = await fetch(url);
	const json = await response.json();
	console.log(json)
	return json
}


function convert(json) {
	if (json["status"] == "OK") {
		var result = json["result"][0];
	}
}