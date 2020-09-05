//Reference HTML div where issues will be displayed
var issueContainerEl = document.querySelector("#issues-container");

//Reference HTML div where limit warning (30+ issues) will display
var limitWarningEl = document.querySelector("#limit-warning");

//Reference HTML span
var repoName = document.querySelector("#repo-name");

//Extract query value from query string in an API call function
var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    // if statement for error handling in case query parameter is unavailable
    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
    
};

//Function to fetch repo issues
var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make a get request to url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);

                //check if repo has 30+ issues and isn't displaying all
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

//Function to display issues
var displayIssues = function(issues) {
    //Alert user if no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    //loop over response data
    for (var i = 0; i < issues.length; i++) {

        //create a link to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);

        //Open link in new tab
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);

        //Append <a> elements
        issueContainerEl.appendChild(issueEl);
    }
};

// Display Warning Function (notify user if 30+ issues exist)
var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

//Call function to extract query value from query string
getRepoName();