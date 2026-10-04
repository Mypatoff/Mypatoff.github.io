document.getElementById("year").textContent = new Date().getFullYear();

(function loadRepos() {
  var statusEl = document.getElementById("repo-status");
  var gridEl = document.getElementById("repo-grid");
  var profileUrl = "https://github.com/Mypatoff";

  function showFallback() {
    statusEl.textContent = "";
    gridEl.textContent = "";
    var p = document.createElement("p");
    var link = document.createElement("a");
    link.href = profileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Couldn't load repositories. See my profile: " + profileUrl;
    p.appendChild(link);
    statusEl.appendChild(p);
  }

  function buildCard(repo) {
    var card = document.createElement("div");
    card.className = "card repo-card";

    var h3 = document.createElement("h3");
    h3.textContent = repo.name;
    card.appendChild(h3);

    var desc = document.createElement("p");
    desc.textContent = repo.description || "No description provided.";
    card.appendChild(desc);

    if (repo.language) {
      var lang = document.createElement("p");
      lang.className = "repo-lang";
      lang.textContent = repo.language;
      card.appendChild(lang);
    }

    var link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn btn-secondary btn-small";
    link.textContent = "View on GitHub";
    card.appendChild(link);

    return card;
  }

  fetch("https://api.github.com/users/Mypatoff/repos?sort=updated&per_page=10")
    .then(function (res) {
      if (!res.ok) throw new Error("bad response");
      return res.json();
    })
    .then(function (repos) {
      if (!Array.isArray(repos)) throw new Error("bad data");

      var filtered = repos.filter(function (r) {
        return !r.fork && r.name !== "Mypatoff.github.io";
      }).slice(0, 6);

      if (filtered.length === 0) {
        showFallback();
        return;
      }

      statusEl.textContent = "";
      filtered.forEach(function (repo) {
        gridEl.appendChild(buildCard(repo));
      });
    })
    .catch(function () {
      showFallback();
    });
})();
