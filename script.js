
// import some polyfill to ensure everything works OK
import "babel-polyfill"

import $ from 'jquery';
// import bootstrap's javascript part
import 'bootstrap';

// import the style
import "./style.scss";

/*
  Put the JavaScript code you want below.
*/
const axios = require('axios');
const markdown = require('markdown').markdown;

const modalHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title"></h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`;

const editorHTML = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h4 class="modal-title">Edit</h4>
      <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>
    <div class="modal-body create-char">
      <input type="text" name="name" class="update-name">
      <img/>
      <input class="image-upload" type="file">
      <input type="text" name="short-description" class="update-short-desc">
      <textarea name="description" class="update-description" rows="8" cols="30"></textarea>
      <img style="display: none"/>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default update-char-btn" data-dismiss="modal">Update</button>
    </div>
  </div>
</div>`;

const deletePromptHTML = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h4 class="modal-title">Delete</h4>
      <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>
    <div class="modal-body delete-char">
      <p>Are you sure you want to delte this character?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default delete-char-btn" data-dismiss="modal">Delete</button>
    </div>
  </div>
</div>`;

const modalTemplate = document.createElement('div');
modalTemplate.classList = 'modal fade';
modalTemplate.setAttribute('role', 'dialog');
modalTemplate.innerHTML = modalHTML;

const characterTemplate = document.createElement('a');
characterTemplate.setAttribute('data-toggle', 'modal');
characterTemplate.classList = 'character-card';

const content = document.querySelector('.content');


(async function loadChars(){
  let characters;
  do {
    try {
      characters = await axios.get('https://character-database.becode.xyz/characters');
    } catch(error){
      console.log(error);
    }
  } while(!characters);
  for(let i = 0; i < characters.data.length; i++){
    let character = characters.data[i];
    let characterNode = characterTemplate.cloneNode(true);

    let name = document.createElement('h3');
    name.innerText = character.name;
    characterNode.appendChild(name);

    let image = new Image();
    image.src = 'data:image/jpg;base64,' + character.image;
    characterNode.appendChild(image);

    let shortDescription = document.createElement('p');
    if(character.shortDescription)
      shortDescription.innerText = character.shortDescription;
    characterNode.appendChild(shortDescription);

    let infoModal = modalTemplate.cloneNode(true);
    infoModal.id = 'info' + i;
    if(character.description)
      infoModal.querySelector('.modal-body').innerHTML = markdown.toHTML(character.description);
    characterNode.setAttribute('data-target', '#' + infoModal.id);
    if(name = infoModal.querySelector('h1'))
      infoModal.querySelector('.modal-title').appendChild(name);
    infoModal.querySelector('.modal-body')
      .insertBefore(image.cloneNode(true), infoModal.querySelector('.modal-body').querySelector('*'));

    let editModal = modalTemplate.cloneNode(true);
    editModal.innerHTML = editorHTML;
    editModal.id = 'edit' + i;
    editModal.querySelector('.update-name').value = character.name;
    editModal.querySelector('.update-short-desc').value = character.shortDescription;
    editModal.querySelector('.update-description').value = character.description;
    editModal.querySelector('img').imageData = character.image;
    editModal.querySelector('img').src = image.src;
    let fileSelector = editModal.querySelector('.image-upload');
    editModal.querySelector('img')
      .addEventListener('click', () => {console.log(fileSelector); fileSelector.click()});

    editModal.querySelector('.update-char-btn')
      .addEventListener('click', () => updateChar(character.id, editModal));

    let editButton = document.createElement('button');
    editButton.classList = 'edit';
    editButton.innerText = '🖊️';
    editButton.addEventListener('click', e => {
      e.stopPropagation();
      $('#' + editModal.id).modal('show');
    });
    characterNode.appendChild(editButton);

    let deleteModal = modalTemplate.cloneNode(true);
    deleteModal.innerHTML = deletePromptHTML;
    deleteModal.id = 'delete' + i;
    deleteModal.querySelector('.delete-char-btn')
      .addEventListener('click', () => deleteChar(character.id));

    let deleteButton = document.createElement('button');
    deleteButton.classList = 'delete';
    deleteButton.setAttribute('data-toggle', 'tooltip');
    deleteButton.title = 'Delete character';
    deleteButton.innerHTML = '&times;';
    deleteButton.addEventListener('click', e => {
      e.stopPropagation();
      $('#' + deleteModal.id).modal('show');
    });
    characterNode.appendChild(deleteButton);

    content.insertBefore(characterNode, content.querySelector('#add-char-card'));
    content.appendChild(infoModal);
    content.appendChild(editModal);
    content.appendChild(deleteModal);
  }
})();


const submitButton = document.querySelector('.add-char-btn');
submitButton.addEventListener('click', postNewChar);

async function postNewChar(){
  const char = {
    name: document.querySelector('.new-name').value,
    shortDescription: document.querySelector('.new-short-desc').value,
    description: document.querySelector('.new-description').value,
    image: ''
  };

  let selectedImages = document.querySelector('.new-image').files
  if(selectedImages.length != 0){
    char.image = await toImageData(selectedImages[0]);
  }

  axios.post('https://character-database.becode.xyz/characters',
    JSON.stringify(char),
    {headers: {'Content-type': 'application/json'}})
    .then((response) => {
      console.log(response);
      window.location.reload();
    })
    .catch((error) => console.log(error));
}

async function updateChar(charId, editorNode){
  const char = {
    name: editorNode.querySelector('.update-name').value,
    shortDescription: editorNode.querySelector('.update-short-desc').value,
    description: editorNode.querySelector('.update-description').value,
    image: editorNode.querySelector('img').imageData
  };

  let selectedImages = editorNode.querySelector('.image-upload').files
  if(selectedImages.length != 0){
    char.image = await toImageData(selectedImages[0]);
  }

  axios.put('https://character-database.becode.xyz/characters/' + charId,
    JSON.stringify(char),
    {headers: {'Content-type': 'application/json'}})
    .then((response) => {
      console.log(response);
      window.location.reload();
    })
    .catch((error) => console.log(error));
}

async function toImageData(imageFile){
  let cv = document.createElement('canvas');
  let img = await createImageBitmap(imageFile);
  [cv.width, cv.height] = [img.width, img.height]
  let ctx = cv.getContext('2d');
  ctx.drawImage(img,0,0);
  return cv.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
}

function deleteChar(charId){
  console.log('Deleting char:', charId);

  axios.delete('https://character-database.becode.xyz/characters/' + charId)
    .then((response) => {
      console.log(response);
      window.location.reload();
    })
    .catch((error) => console.log(error));
}
