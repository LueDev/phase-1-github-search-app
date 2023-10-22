
//Using this github accept : 'Accept: application/vnd.github.v3+json'

//Github Endpoint: https://api.github.com/search/users?q=octocat

//This endpoint is rate limited. This means the API will stop returning data if you make more than 10 requests per minuteLinks to an external site..

//USING THE REST API and Search Queries https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#constructing-a-search-query
//Remember to separate search queries by '&' such as 'q=Lue&per_page=10'

document.addEventListener('DOMContentLoaded', ()=>{

ghUserContainer = document.querySelector('#user-list')
ghRepoContainer = document.querySelector('#repos-list')

gitUserSearch = document.querySelector('form')
gitUserSearch.addEventListener('submit', (event) => {
    event.preventDefault()
    getUser(event.target[0].value)
})

})

async function getUser(name){
    
    const configObj = {
        "method": "GET",
        "headers": {
          "Content-type": "application/json",
          Accept: "application/vnd.github.v3+json",
        }
      }
    //List github profile pic/name and grab the first three repos attached to the person found
    fetch(`https://api.github.com/search/users?q=${name}`, configObj)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        ghUserContainer.innerHTML = ""

        usersFound = data.items
        console.log('Users Found: ', usersFound)

        //For each can return index along with value similar to python's enumerate func
        usersFound.forEach((userFound) => {
            // console.log(userFound)
            const newUser = document.createElement('li')
            const newUserImg = document.createElement('img')
            const newUserName = document.createElement('p')
            newUserImg.src = userFound.avatar_url
            newUserName.innerText = userFound.login
            newUser.append(newUserImg)
            newUser.append(newUserName)

            newUser.addEventListener('click', ()=>{
                getRepos(userFound.login)
            })

            ghUserContainer.append(newUser)
        })
        

    })
    .catch(err => {
        const errRender = document.createElement('p')
        errRender.innerHTML = `${username} not found.`
        ghUserContainer.append(errRender)
        console.log('error: ', err)})

}

function getRepos(username){
    fetch(`https://api.github.com/users/${username}/repos?per_page=10`)
    .then(res => res.json())
    .then(data => {
        ghRepoContainer.innerHTML = ""
        //
        const userName = document.createElement('p')
        userName.innerHTML = `<h2>${username}'s Top 10 GitHub Repos</h2>`
        ghRepoContainer.append(userName)

        data.forEach(repoFound => {
            console.log(repoFound)
            
            const newRepo = document.createElement('li')
            const newRepoName = document.createElement('p')
            const newRepoDescription = document.createElement('p')
            
            newRepoName.classList.add('repo-header')
            newRepoName.innerHTML = `<a href="${repoFound.html_url}" target="_blank"><h3>${repoFound.full_name}</h3></a>`
            newRepoDescription.classList.add('repo-description')
            newRepoDescription.innerHTML = repoFound.description
            newRepo.append(newRepoName)
            newRepo.append(newRepoDescription)

            ghRepoContainer.append(newRepo)

        })
    })
    .catch(err => {
        const errRender = document.createElement('p')
        errRender.innerHTML = `${username} not found.`
        ghRepoContainer.append(errRender)
        console.log('error: ', err)})

}
