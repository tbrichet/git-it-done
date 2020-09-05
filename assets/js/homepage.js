
//Reference HTML Form
var userFormEl = document.querySelector("#user-form");

//Reference HTML Input on Form
var nameInputEl = document.querySelector("#username");

//Reference HTML Div where Repos will Display
var repoContainerEl = document.querySelector("#repos-container");

//Reference HTML Span where Searched Username Will Display
var repoSearchTerm = document.querySelector("#repo-search-term");

//Submit Form and Send Input to getUserRepos Function
var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value="";
    } else {
        alert("Please enter a GitHub username");
    }
    console.log(event);
};

// Function to Fetch User Repos
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                //When response data is converted to JSON, send to displayRepos() function
                displayRepos(data, user);
            });
        } else {
            //request was unsuccessful
            alert("Error: " + response.statusText);
        }
    })
    //Alert user if network errors exist
    .catch(function(error) {
        //Notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to Github");
    });
};

//Event Listener for Form Submit
userFormEl.addEventListener("submit", formSubmitHandler);

//Function to Display Repos
var displayRepos = function(repos, searchTerm) {
    //check if api returned any repos (does user have repos?)
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositiories found.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);

    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i =0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a link for each repo that directs to the single-repo page
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-betwen align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" +repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>"
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);  
    };
};