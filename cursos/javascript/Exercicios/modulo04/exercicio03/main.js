var inputName = document.querySelector('#app input[name=user]');
var buttonSearch = document.querySelector('#app button');
var lista = document.querySelector('#app ul');

var buscaUsuario = function(userName) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${userName}/repos`);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject('Erro na requisição');
        }
      }
    }
  });
}

function searchButtonCLick() {
  lista.innerHTML = '';
  var listIten = document.createElement('li');
  var listText = document.createTextNode('Carregando...');
  listIten.appendChild(listText);
  lista.appendChild(listIten);
  buscaUsuario(inputName.value)
  .then(function(response) {
    lista.innerHTML = '';
    for (repo of response) {
      listIten = document.createElement('li');
      listText = document.createTextNode(repo.name);
      listIten.appendChild(listText);
      lista.appendChild(listIten);
    }
  })
  .catch(function(error) {
    lista.innerHTML = ''
    var listIten = document.createElement('li');
    var listText = document.createTextNode('Usuário não encontrado!');
    listIten.appendChild(listText);
    lista.appendChild(listIten);
  });
}

buttonSearch.onclick = searchButtonCLick;