const username = "AC1DST4R";

/* MANUAL PINNED REPOS (EDIT THIS) */
const pinnedRepos = [
  "repo-name-1",
  "repo-name-2"
];

const $ = id => document.getElementById(id);
let allRepos = [];

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
  $("githubLink").href = u.html_url;

  $("contribGraph").src = `https://ghchart.rshah.org/${u.login}`;
}

/* REPOS */
async function loadRepos() {
  const r = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  allRepos = await r.json();

  renderPinned();
  renderRepos(allRepos);
}

function repoCard(repo) {
  return `
    <div class="repo">
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="desc">${repo.description || ""}</div>
      ⭐ ${repo.stargazers_count}
      ${repo.has_pages ? `<div>📄 <a href="https://${username}.github.io/${repo.name}/" target="_blank">Live</a></div>` : ""}
    </div>`;
}

function renderPinned() {
  $("pinnedList").innerHTML = "";
  allRepos
    .filter(r => pinnedRepos.includes(r.name))
    .forEach(r => $("pinnedList").innerHTML += repoCard(r));
}

function renderRepos(list) {
  $("repoList").innerHTML = "";
  list.forEach(r => $("repoList").innerHTML += repoCard(r));
}

$("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderRepos(allRepos.filter(r => r.name.toLowerCase().includes(q)));
});

/* ACTIVITY */
async function loadActivity() {
  const r = await fetch(`https://api.github.com/users/${username}/events`);
  const events = await r.json();

  $("activityList").innerHTML = "";
  events.slice(0, 8).forEach(e => {
    $("activityList").innerHTML += `
      <div class="activity-item">
        ${e.type.replace("Event","")} • ${new Date(e.created_at).toLocaleDateString()}
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
