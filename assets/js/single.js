//Reference HTML div where issues will be displayed
var issueContainerEl = document.querySelector("#issues-container");


//Function to fetch repo issues
var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};
getRepoIssues("facebook/react");

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