const username = "AC1DST4R";

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const userEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const reposEl = document.getElementById("repos");
const repoList = document.getElementById("repoList");
const search = document.getElementById("search");
const githubLink = document.getElementById("githubLink");

let allRepos = [];

async function loadProfile() {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const user = await res.json();

  avatar.src = user.avatar_url;
  nameEl.textContent = user.name || username;
  userEl.textContent = "@" + user.login;
  bioEl.textContent = user.bio || "";
  followersEl.textContent = `${user.followers} followers`;
  followingEl.textContent = `${user.following} following`;
  reposEl.textContent = `${user.public_repos} repos`;
  githubLink.href = user.html_url;
}

function renderRepos(repos) {
  repoList.innerHTML = "";

  repos.forEach(repo => {
    const div = document.createElement("div");
    div.className = "repo";

    const pagesUrl = `https://${username}.github.io/${repo.name}/`;

    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="desc">${repo.description || ""}</div>
      <div class="meta">⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}</div>
      ${
        repo.has_pages
          ? `<div class="pages">📄 <a href="${pagesUrl}" target="_blank">Live Page</a></div>`
          : ""
      }
    `;

    repoList.appendChild(div);
  });
}

async function loadRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  allRepos = await res.json();

  allRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  renderRepos(allRepos);
}

search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  renderRepos(
    allRepos.filter(r => r.name.toLowerCase().includes(value))
  );
});

loadProfile();
loadRepos();
