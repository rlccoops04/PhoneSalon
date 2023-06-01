const open_catalog_btn = document.querySelector('.open_catalog'),
      strips = document.querySelectorAll('.strip'),
      catalog = document.querySelector('.main_block_catalog'),
      login_btn = document.querySelector('.login_btn'),
      modal = document.querySelector('.modal'),
      main_block = document.querySelector('.main_block'),
      token = localStorage.getItem('token'),
      new_block = document.querySelector('.main_block_news'),
      basket_length = document.querySelector('.basket_length'),
      register_form = document.forms['register_form'],
      login_form = document.forms['login_form'];
let basket = sessionStorage.getItem('basket');
if(basket) {
    basket_length.innerText = JSON.parse(basket).length;
}
else  {
    basket_length.innerText = 0;
}

open_catalog_btn.addEventListener('click', () => {
    if(open_catalog_btn.classList.contains('active')) {
        open_catalog_btn.style.cssText = 'background-color:rgb(135, 0, 173);color: white;';
        strips.forEach(strip => {strip.style.cssText = 'background-color:white;';});
    } else {
        open_catalog_btn.style.cssText = 'background-color: white;color: rgb(135, 0, 173);';
        strips.forEach(strip => {strip.style.cssText = 'background-color:rgb(135, 0, 173);';});
    }
    open_catalog_btn.classList.toggle('active');
    catalog.classList.toggle('hide');
    catalog.classList.toggle('show');
    console.log(strips[0]);
});

modal.addEventListener('click', (e) => {
    if(e.target == modal) {
        modalclassList.add('hide');
    }
});

login_form.elements['button'].addEventListener('click',  async (e) => {
    const username = login_form.elements['username'].value;
    const password = login_form.elements['password'].value;
    console.log(username, password);
    const response = await fetch('/auth/login', {
        method: "POST",
        headers: {
            'Accept-Type' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    const token = await response.json();
    localStorage.setItem('token', token);
});
const modal_authorize = document.querySelector('.modal_authorize');
const open_reg_form = document.querySelector('.modal_authorize_reg span');
const modal_register = document.querySelector('.modal_register');
open_reg_form.addEventListener('click', () => {
    modal_authorize.classList.add('hide');
    modal_register.classList.remove('hide');
});
register_form.elements['button'].addEventListener('click', async (e) => {
    const name = register_form.elements['name'].value;
    const tel = register_form.elements['tel'].value;
    const username = register_form.elements['username'].value;
    const password = register_form.elements['password'].value;
    const response = await fetch('/auth/registration', {
        method: "POST",
        headers: {
            "Accept-Type" : 'application/json',
            "Content-Type" : 'application/json'
        },
        body: JSON.stringify({name,tel,username,password, role: 'Пользователь'})
    });
});

async function AuthorizeStatus() {
    if(token) {
        const response = await fetch('/get/user', {
            method: "GET",
            headers: {
                'Accept-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
        if(response.ok) {
            login_btn.innerText = 'Выход';
            login_btn.addEventListener('click', () => {
                localStorage.removeItem('token');
                sessionStorage.removeItem('basket');
                location.reload();
            });
            const user = await response.json();
            if(user.roles[0] == 'Администратор' || user.roles[0] == 'Менеджер') {
                const redirect_btn = document.createElement('a');
                const menu = document.querySelector('.header_menu');
                redirect_btn.innerText = 'Панель управления';
                redirect_btn.style.cssText = 'color: white;position: absolute;font-size: 14px;top: 8px;left: 30px;cursor: pointer;';
                redirect_btn.href = '/admin/control';
                menu.prepend(redirect_btn);
    
            }
        } else {
            login_btn.innerText = 'Вход';
            login_btn.addEventListener('click', () => {
                modal.classList.remove('hide');
                modal_authorize.classList.remove('hide');
            });
        }
    } else {
        login_btn.innerText = 'Вход';
        login_btn.addEventListener('click', () => {
            modal.classList.remove('hide');
            modal_authorize.classList.remove('hide');
    });
    }
}

AuthorizeStatus();
let user;
async function start() {
    const response = await fetch('/get/user', {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    user = await response.json();
    console.log(user);
    const inp_name = document.createElement('input');
    const inp_tel = document.createElement('input');
    const inp_username = document.createElement('input');
    const inp_password = document.createElement('input');
    const inp_role = document.createElement('input');
    inp_role.setAttribute('disabled', '');
    main_block.append(inp_name);
    main_block.append(inp_tel);
    main_block.append(inp_username);
    main_block.append(inp_password);
    main_block.append(inp_role);
    inp_name.value = user.name;
    inp_tel.value = user.tel;
    inp_username.value = user.username;
    inp_password.value = user.password;
    inp_role.value = user.roles[0];
    const confirm_btn = document.createElement('button');
    confirm_btn.innerText = 'Сохранить';
    confirm_btn.style.cssText = 'margin-top: 20px;border: none;border-radius: 5px;width: 150px;background-color:green;color:white;height:30px;';
    confirm_btn.addEventListener('click',async () => {
        const name = inp_name.value;
        const tel = inp_tel.value;
        const username = inp_username.value;
        const password = inp_password.value;
        if(name && tel && username && password) {
            const resp = await fetch('/put/user', {
                method: "PUT",
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({name, tel, username, password})
            });
            if(resp.ok) {
                window.location.reload();
            }
        }
    });
    main_block.append(confirm_btn);
}
start();

const smartphones = document.querySelector('.smartphones');
smartphones.addEventListener('click', () => {
    window.location.href = '/catalog/smartphones';
});
const watches = document.querySelector('.watches');
watches.addEventListener('click', () => {
    window.location.href = '/catalog/watches';
});
const accessories = document.querySelector('.accessories');
accessories.addEventListener('click', () => {
    window.location.href = '/catalog/accessories';
});
const rechargers = document.querySelector('.rechargers');
rechargers.addEventListener('click', () => {
    window.location.href = '/catalog/rechargers';
});
const bsk_btn = document.querySelector('.basket');
bsk_btn.addEventListener('click', () => {
    window.location.href = '/basket'
});

const search_input = document.querySelector('.search_input'),
      search_btn = document.querySelector('.search_btn'),
      title_block = document.querySelector('.main_block_title');


search_btn.addEventListener('click', () => {
    const search = search_input.value;
    if(search.length != 0) {
        title_block.innerText = 'Найдено';
        const newproducts = products.filter(prod => 
            search.includes(prod.name.includes) ||
            prod.name.includes(search) ||
            prod.model.name_model.includes(search) ||
            prod.model.producer.includes(search) ||
            search.includes(prod.model.name_model) ||
            search.includes(prod.model.producer) ||
            search == `${prod.model.producer} ${prod.model.name_model}`);
        Show(newproducts);
    } else {
        title_block.innerText = 'Новинки';
        const newproducts = [products[products.length - 1], products[products.length - 2], products[products.length - 3], products[products.length - 4], products[products.length - 5], ];
        Show(newproducts);
    }
});