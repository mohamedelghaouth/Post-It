import { http } from "./http.js";
import { ui } from "./uiCtrl.js";

  // Load event listeners
function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', getPosts);
    document.querySelector('.card-form').addEventListener('click', cancelEdit);

    ui.postSubmit.addEventListener('click', submitPost);
    ui.post.addEventListener('click', deletePost);
    ui.post.addEventListener('click', enableEdit);
}

function getPosts(e){
     http.get("http://localhost:3000/posts")
        .then((data) => {
            ui.showPosts(data);
        }).catch((err) => {
            return []
        });
}


// Submit Post
function submitPost() {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;
  
    const data = {
      title,
      body
    }
  
    // Validate input
    if(title === '' || body === '') {
      ui.showAlert('Please fill in all fields', 'alert alert-danger');
    } else {
      // Check for ID
      if(id === '') {
        // Create Post
        http.post('http://localhost:3000/posts', data)
        .then(data => {
          ui.showAlert('Post added', 'alert alert-success');
          ui.clearFields();
          getPosts();
        })
        .catch(err => console.log(err));
      } else {
        // Update Post
        http.put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
          ui.showAlert('Post updated', 'alert alert-success');
          ui.changeFormState('add');
          getPosts();
        })
        .catch(err => console.log(err));
      }
  
    }
  }

  // Delete Post
function deletePost(e) {
    if(e.target.parentElement.classList.contains('delete')) {
      const id = e.target.parentElement.dataset.id;
      if(confirm('Are you sure?')) {
        http.delete(`http://localhost:3000/posts/${id}`)
          .then(data => {
            ui.showAlert('Post removed', 'alert alert-success');
            getPosts();
          })
          .catch(err => console.log(err));
      }
    }
    e.preventDefault();
}

function enableEdit(e) {
    if(e.target.parentElement.classList.contains('edit')) {
      const id = e.target.parentElement.dataset.id;
      const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
      const body = e.target.parentElement.previousElementSibling.textContent;
      
      const data = {
        id,
        title,
        body
      }
      ui.fillForm(data);
    }
    e.preventDefault();
}

// Cancel Edit State
function cancelEdit(e) {
    if(e.target.classList.contains('post-cancel')) {
      ui.changeFormState('add');
    }
  
    e.preventDefault();
}  

loadEventListeners();