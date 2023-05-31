const content = document.querySelector('.content_main'),
      token = localStorage.getItem('token'),
      sortby = document.querySelector('.sortby'),
      btn_search = document.querySelector('.btn_search'),
      search_input = document.querySelector('.search_input');
const open_modal_btn = document.querySelector('.open_modal'),
      modal = document.querySelector('.modal'),
      modal_choice_role = document.querySelector('.modal_choice_role'),
      modal_create_user = document.querySelector('.modal_create_user'),
      create_user_form = document.forms['create_user'],
      edit_user_form = document.forms['edit_user'],
      modal_edit_user = document.querySelector('.modal_edit_user'),
      modal_choice_role_items = document.querySelectorAll('.modal_choice_role_item');
let role;
btn_search.addEventListener('click', () => {
    const search = search_input.value;
    if(search.length != 0) {
        const searched = users.filter(
            user => user._id == search ||
            user.username == search ||
            user.password == search ||
            user.name.includes(search) ||
            user.tel == search ||
            user.roles[0].includes(search) 
        );
        Show(searched);
    } else {
        Show(users);
    }
});
sortby.addEventListener('change', () => {
    if(sortby.value == 'loginup') {
        users.sort((a,b) => a.username > b.username ? 1 : -1);
    }
    if(sortby.value == 'logindown') {
        users.sort((a,b) => a.username < b.username ? 1 : -1);
    }
    if(sortby.value == 'fioup') {
        users.sort((a,b) => a.name > b.name ? 1 : -1);
    }
    if(sortby.value == 'fiodown') {
        users.sort((a,b) => a.name < b.name ? 1 : -1);
    }
    if(sortby.value == 'roleup') {
        users.sort((a,b) => a.roles[0] > b.roles[0] ? 1 : -1);
    }
    if(sortby.value == 'roledown') {
        users.sort((a,b) => a.roles[0] < b.roles[0] ? 1 : -1);
    }
    Show(users);
});
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
    Show(users);
}
function Show(users) {
    content.innerHTML = '';
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
    tel_title.style.cssText = 'width: 140px;';
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
    tel_title.style.cssText = 'width: 140px;';
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
    const btn_block = document.createElement('div');
    const remove_btn = document.createElement('img');
    const edit_btn = document.createElement('img');
    remove_btn.src = '../images/remove.png';
    remove_btn.style.cssText = 'width: 25px;height: 25px;cursor: pointer;margin-left: 10px;';
    remove_btn.addEventListener('click', async () => {
        if(confirm(`Вы уверен, что хотите удалить пользователя ${user.username}?`)) {
            const response = await fetch('/admin/delete/user/' + user._id, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                }
            });
            if(response.ok) {
                const result = await response.json();
                console.log(result);
                row.remove();
            }
        }
    });
    edit_btn.src = '../images/edit.png';
    edit_btn.style.cssText = 'width: 27px;height: 27px;cursor: pointer;';
    edit_btn.addEventListener('click', () => {
        modal.classList.remove('hide');
        modal_edit_user.classList.remove('hide');
        edit_user_form.elements['username'].value = user.username;
        edit_user_form.elements['password'].value = user.password;
        edit_user_form.elements['surname'].value = user.name.split(' ')[0];
        edit_user_form.elements['name'].value = user.name.split(' ')[1];
        edit_user_form.elements['patronymic'].value = user.name.split(' ')[2];
        edit_user_form.elements['tel'].value = user.tel;
        edit_user_form.elements['confirm'].addEventListener('click', async (e) => {
            e.preventDefault();
            const username = edit_user_form.elements['username'].value,
                  password = edit_user_form.elements['password'].value,
                  name = `${edit_user_form.elements['surname'].value} ${edit_user_form.elements['name'].value} ${edit_user_form.elements['patronymic'].value}`;
                  tel = edit_user_form.elements['tel'].value;
            const response = await fetch('/admin/put/user/' + user._id, {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({username, password,name,tel,role})
            });
            if(response.ok) {
                location.reload();
            }
        
        });
        
    });
    btn_block.append(edit_btn);
    btn_block.append(remove_btn);
    row.append(btn_block);
    table.append(row);
}

start();

console.log(create_user_form);
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
create_user_form.elements['confirm'].value = 'Создать';
create_user_form.elements['confirm'].addEventListener('click', async (e) => {
    const username = create_user_form.elements['username'].value,
          password = create_user_form.elements['password'].value,
          name = `${create_user_form.elements['surname'].value} ${create_user_form.elements['name'].value} ${create_user_form.elements['patronymic'].value}`;
          tel = create_user_form.elements['tel'].value;
    const response = await fetch('/auth/registration', {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({username, password,name,tel,role})
    });
    const newuser = await response.json();
})