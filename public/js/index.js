const user_btn = document.querySelector('.user-container');
const register = document.querySelector('.registration-btn');
const login = document.querySelector('.login-btn');

register.addEventListener('click',()=>{
    user_btn.classList.add('login-section--display')
})

login.addEventListener('click',()=>{
    user_btn.classList.remove('login-section--display')
})