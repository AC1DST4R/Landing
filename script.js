const username = "AC1DST4R";

const $ = id => document.getElementById(id);
let repos = [];

/* PROFILE */
async function loadProfile() {
  const r = await fetch(`https://api.github.com/users/${username}`);
  const u = await r.json();

  $("avatar").src = u.avatar_url;
  $("name").textContent = u.name || u.login;
  $("username").textContent = "@" + u.login;
  $("bio").textContent = u.bio || "";
  $("followers").textContent = `${u.followers} followers`;
  $("following").textContent = `${u.following} following`;
  $("repos").textContent = `${u.public_repos} repos`;
  $("githubLink").href = u.html_url;

  $("contribGraph").src =
    `https://ghchart.rshah.org/${u.login}`;
}

/* REPOS */
async function loadRepos() {
  const r = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  repos = await r.json();
  renderRepos(repos);
  renderPages();
}

function renderRepos(list) {
  $("repoList").innerHTML = "";
  list.forEach(repo => {
    $("repoList").innerHTML += `
      <div class="repo">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <div class="desc">${repo.description || ""}</div>
        <div>⭐ ${repo.stargazers_count}</div>
        ${repo.has_pages ? `<div class="pages">📄 <a href="https://${username}.github.io/${repo.name}/" target="_blank">Live Page</a></div>` : ""}
      </div>`;
  });
}

$("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderRepos(repos.filter(r => r.name.toLowerCase().includes(q)));
});

/* PAGES */
function renderPages() {
  $("pagesList").innerHTML = "";
  repos.filter(r => r.has_pages).forEach(repo => {
    $("pagesList").innerHTML += `
      <div class="repo">
        <a href="https://${username}.github.io/${repo.name}/" target="_blank">${repo.name}</a>
      </div>`;
  });
}

/* ACTIVITY */
async function loadActivity() {
  const r = await fetch(`https://api.github.com/users/${username}/events`);
  const events = await r.json();

  $("activityList").innerHTML = "";
  events.slice(0, 10).forEach(e => {
    $("activityList").innerHTML += `
      <div class="activity">
        ${e.type.replace("Event", "")} • ${new Date(e.created_at).toLocaleString()}
      </div>`;
  });
}

/* TABS */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    $(tab.dataset.tab).classList.add("active");
  };
});

loadProfile();
loadRepos();
loadActivity();
