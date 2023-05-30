const open_catalog_btn = document.querySelector('.open_catalog'),
      strips = document.querySelectorAll('.strip'),
      catalog = document.querySelector('.main_block_catalog'),
      login_btn = document.querySelector('.login_btn'),
      modal = document.querySelector('.modal'),
      token = localStorage.getItem('token'),
      new_block = document.querySelector('.main_block_news'),
      top_block = document.querySelector('.main_block_topsells'),
      basket_length = document.querySelector('.basket_length'),
      content = document.querySelector('.main_content_right_content'),
      login_form = document.forms['login_form'],
      register_form = document.forms['register_form'];
let basket = sessionStorage.getItem('basket');
if(basket) {
    basket_length.innerText = JSON.parse(basket).length;
} else {
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
        modal.classList.add('hide');
        modal_authorize.classList.add('hide');
        modal_register.classList.add('hide');
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
// register_form.elements['button'].addEventListener('click', async (e) => {
//     const name = register_form.elements['name'].value;
//     const tel = register_form.elements['tel'].value;
//     const username = register_form.elements['username'].value;
//     const password = register_form.elements['password'].value;
//     const response = await fetch('/auth/registration', {
//         method: "POST",
//         headers: {
//             "Accept-Type" : 'application/json',
//             "Content-Type" : 'application/json'
//         },
//         body: JSON.stringify({name,tel,username,password, role: 'Пользователь'})
//     });
// });

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
            if(user.roles[0] == 'Администратор') {
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
            });
        }
    } else {
        login_btn.innerText = 'Вход';
        login_btn.addEventListener('click', () => {
            modal.classList.remove('hide');
        });
    }
}

AuthorizeStatus();
const title = document.querySelector('.main_content_right_title');
content.style.cssText = 'display: flex;flex-direction:column;'
function ShowCurrent() {
    let sum = 0;
    content.innerHTML = ``;
    if(!basket) {
        title.innerHTML = 'Корзина пуста';
    } else {
        title.innerHTML = 'Ваша корзина';
        prods.forEach(prod => {
            const block = document.createElement('div');
            block.style.cssText = 'display: flex;margin-top:30px;';
            const img_block = document.createElement('div');
            img_block.style.cssText = 'height:100px;width:150px;display:flex;justify-content:center;align-items:center;';
            const img = document.createElement('img');
            img.src = prod.model.img;
            img.style.cssText = 'height: 100%;';
            img_block.append(img);
            block.append(img_block);
            const block_name = document.createElement('div');
            block_name.innerHTML = `<span style='color: rgb(200,200,200)'>${prod.name}</span><br>${prod.model.producer} ${prod.model.name_model}<br><br>`;
            block_name.style.position = 'relative';
            const strip = document.createElement('div');
            strip.style.cssText = 'width: 5px;height:30px;position: absolute;top:70px;left:0px';
            block_name.append(strip);
            if(Number(prod.available) != 0) {
                strip.style.backgroundColor = 'green';
                block_name.innerHTML += '<span style=`display:block;margin-left:10px;`>Товар в наличии</span>';
            } else {
                strip.style.backgroundColor = 'red';
                block_name.innerHTML += '<span style=`display:block;margin-left:10px;`>Товара нет в наличии</span>';
            }
            block_name.style.cssText += 'width: 700px;'
            block.append(block_name);
            const price_block = document.createElement('div');
            let price = Number(prod.price);
            sum += price;
            price = price.toLocaleString('ru-RU');
            price_block.innerText = price + ' ₽';
            price_block.style.cssText = 'display:flex;justify-content:center;align-items:center;font-weight:700;font-size:20px;';
            block.append(price_block);
            content.append(block);
        });
        const confirm_block = document.createElement('div');
        confirm_block.style.cssText = 'width: 1000px;height: 100px;border-top: 1px solid gray;display:flex;align-items:center;margin-top:30px;';
        const summary = document.createElement('div');
        summary.innerText = `Итого к оплате: ${sum} ₽`;
        summary.style.cssText = 'width: 700px;height: 100px;font-size: 22px;font-weight: 500;display:flex;align-items:center;padding-left: 50px;';
        confirm_block.append(summary);
        const confirm_btn = document.createElement('button');
        confirm_btn.innerText = 'Оформить заказ';
        confirm_btn.style.cssText = 'height: 50px;width: 250px;border:none;border-radius: 5px;background-color: green;color:white;';
        confirm_block.addEventListener('click', async () => {
            const response = await fetch('/post/order', {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({basket})
            });
            const order = await response.json();
            if(response.ok) {
                sessionStorage.removeItem('basket');
                window.location.href = '/';
            }
            console.log(order);
        });
        confirm_block.append(confirm_btn);
        content.append(confirm_block);    
    }
}

async function ShowAll() {
    content.innerHTML = ``;
    title.innerHTML = 'Мои заказы';
    orders.forEach(order => {
        let sum = 0;
        const block = document.createElement('div');
        block.style.cssText = 'border: 2px solid rgb(200,200,200);margin-top: 20px;padding: 10px;display:flex;';
        const block_content = document.createElement('div');
        block_content.style.cssText = 'width:600px;';
        block_content.innerHTML += `Заказ <span style='font-weight:700'>№${order._id}</span><br>Заказчик: <span style='font-weight:700'>${order.customer.name}</span><br>Контактный телефон: <span style='font-weight:700'>${order.customer.tel}</span><br>Содержимое заказа: <br>`;
        order.products.forEach(product => {
            sum += Number(product.price);
            block_content.innerHTML += `• Категория: <span style='font-weight:700'>${product.name}</span>, модель: <span style='font-weight:700'>${product.model.producer} ${product.model.name_model}</span> ( ${product.price} р. )<br>`;
        });
        block_content.innerHTML += `Сумма заказа: ${sum}`;
        block.append(block_content);
        const block_status = document.createElement('div');
        block_status.style.cssText = 'display:flex;justify-content:center;align-items:center;font-size:22px;';
        block_status.innerHTML = `Статус заказа: ${order.status}`;
        block.append(block_status);
        content.append(block);
    });
}
let prods = [];
let orders;
async function start() {
    const response = await fetch('/get/products', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    const products = await response.json();
    products.forEach(prod => {
        if(basket) {
            if(basket.includes(prod._id)) {
                prods.push(prod);
            }
        }

    });
    ShowCurrent();
    const resp = await fetch('/get/orders', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    orders = await resp.json();
    console.log(orders);
}
start();
const tabs = document.querySelectorAll('.main_content_left_tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        if(tab.innerText == 'Оформление заказа') {
            ShowCurrent();
        }
        else if(tab.innerText == 'Мои заказы') {
            ShowAll();
        }
    });
});
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