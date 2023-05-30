const content = document.querySelector('.content_main'),
      token = localStorage.getItem('token');

content.style.cssText = 'padding: 30px';
let users;
async function start() {
    const response = await fetch('/admin/get/users', {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    })
    users = await response.json();
    const table = CreateTable();
    content.append(table);
    users.forEach(user => {
        CreateRow(user,table);
    });

}

function CreateTable() {
    const table = document.createElement('div');
    table.style.cssText = 'border-left: 1px solid gray;border-right: 1px solid gray;';
    const table_titles = document.createElement('div');
    table_titles.style.cssText = 'display: flex;padding: 5px;background-color: rgb(0,100,255);color:white;border-bottom: 1px solid gray;';
    const id_title = document.createElement('div');
    id_title.style.cssText = 'width: 200px;';
    const username_title = document.createElement('div');
    username_title.style.cssText = 'width: 200px;';
    const password_title = document.createElement('div');
    password_title.style.cssText = 'width: 200px;';
    const name_title = document.createElement('div');
    name_title.style.cssText = 'width: 300px;';
    const tel_title = document.createElement('div');
    tel_title.style.cssText = 'width: 200px;';
    const role_title = document.createElement('div');
    role_title.style.cssText = 'width: 140px;';
    id_title.innerText = 'ID';
    username_title.innerText = 'Логин';
    password_title.innerText = 'Пароль';
    name_title.innerText = 'ФИО';
    tel_title.innerText = 'Телефон';
    role_title.innerText = 'Роль';
    table_titles.append(id_title);
    table_titles.append(username_title);
    table_titles.append(password_title);
    table_titles.append(name_title);
    table_titles.append(tel_title);
    table_titles.append(role_title);
    table.append(table_titles);
    return table;
}
function CreateRow(user,table) {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex;padding: 5px;border-bottom: 1px solid gray;';
    const id_title = document.createElement('div');
    id_title.style.cssText = 'width: 200px;font-size: 12px;';
    const username_title = document.createElement('div');
    username_title.style.cssText = 'width: 200px;';
    const password_title = document.createElement('div');
    password_title.style.cssText = 'width: 200px;';
    const name_title = document.createElement('div');
    name_title.style.cssText = 'width: 300px;';
    const tel_title = document.createElement('div');
    tel_title.style.cssText = 'width: 200px;';
    const role_title = document.createElement('div');
    role_title.style.cssText = 'width: 140px;';
    id_title.innerText = user._id;
    username_title.innerText = user.username;
    password_title.innerText = user.password;
    user.name ? name_title.innerText = user.name : name_title.innerText = '-';
    user.tel ? tel_title.innerText = user.tel : tel_title.innerText = '-';
    role_title.innerText = user.roles[0];
    row.append(id_title);
    row.append(username_title);
    row.append(password_title);
    row.append(name_title);
    row.append(tel_title);
    row.append(role_title);

    table.append(row);
}

start();

const open_modal_btn = document.querySelector('.open_modal'),
      modal = document.querySelector('.modal'),
      modal_choice_role = document.querySelector('.modal_choice_role'),
      modal_create_user = document.querySelector('.modal_create_user'),
      modal_edit_user = document.querySelector('.modal_edit_user'),
      modal_choice_role_items = document.querySelectorAll('.modal_choice_role_item');
let role;

open_modal_btn.addEventListener('click', () => {
    modal.classList.remove('hide');
    modal_choice_role.classList.remove('hide');
});

modal.addEventListener('click', (e) => {
    if(e.target == modal) {
        modal.classList.add('hide');
        modal_choice_role.classList.add('hide');
        modal_create_user.classList.add('hide');
        modal_edit_user.classList.add('hide');
    }
});
modal_choice_role_items.forEach(item => {
    item.addEventListener('click', (e) => {
        if(e.target.classList.contains('admin')) {
            role = 'Администратор';
        }
        else if(e.target.classList.contains('user')) {
            role = 'Пользователь';
        } else if(e.target.classList.contains('manager')) {
            role = 'Менеджер';
        }
        modal_choice_role.classList.add('hide');
        modal_create_user.classList.remove('hide');
    });
});