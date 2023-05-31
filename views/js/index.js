const open_catalog_btn = document.querySelector('.open_catalog'),
      strips = document.querySelectorAll('.strip'),
      catalog = document.querySelector('.main_block_catalog'),
      login_btn = document.querySelector('.login_btn'),
      modal = document.querySelector('.modal'),
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

async function start() {
    const response = await fetch('/get/products', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    const products = await response.json();
    const newproducts = [products[products.length - 1], products[products.length - 2], products[products.length - 3], products[products.length - 4], products[products.length - 5], ];
    newproducts.forEach(product => {
        const block = document.createElement('div');
        block.style.cssText = 'width: 300px;min-height: 400px;border: 0.5px solid rgb(230,230,230);padding: 20px;padding-bottom:50px;border-right: none;border-bottom:none;';
        block.addEventListener('mouseenter', () => {
            block.style.cssText = 'width: 300px;min-height: 400px;border: 0.5px solid rgb(230,230,230);padding: 20px;box-shadow: 5px 5px 10px gray;padding-bottom:50px;border-right: none;border-bottom:none';
        });
        block.addEventListener('mouseleave', () => {
            block.style.cssText = 'width: 300px;min-height:400px;border: 0.5px solid rgb(230,230,230);padding: 20px;padding-bottom:50px;border-right: none;border-bottom:none';
        });
        const img = document.createElement('img');
        img.style.cssText = 'display:block;height: 250px;margin:0 auto 20px auto;';
        img.src = product.model.img;
        block.append(img);
        block.innerHTML += `<span style='font-size: 14px;color:rgb(170,170,170);'>${product.name}</span><br>${product.model.producer} ${product.model.name_model} `;
        const price_block = document.createElement('div');
        price_block.style.cssText = 'margin-top: 20px;font-weight: 700;font-size: 20px;position:relative;'
        let price = Number(product.price);
        price = price.toLocaleString('ru-RU');
        price_block.innerText = price + ' ₽';
        block.append(price_block);
        const buy_btn = document.createElement('button');
        buy_btn.style.cssText = 'border:none;background-color: rgb(255, 196, 0);color: purple;font-weight: 700;border-radius: 5px;position: absolute;right:0;bottom:0';
        if(basket) {
            if(basket.includes(product._id)) {
                buy_btn.innerText = 'В корзине';
                buy_btn.addEventListener('click', () => {
                    let prods = JSON.parse(basket);
                    for(let i = 0; i< prods.length; i++) {
                        if(prods[i] == product._id) {
                            prods.splice(i,1);
                            sessionStorage.setItem('basket', JSON.stringify(prods));
                        }
                    }
                    buy_btn.innerText = 'Купить';
                    basket = sessionStorage.getItem('basket');
                    basket_length.innerText = JSON.parse(basket).length;
                    buy_btn.setAttribute('disabled','');
                });
            } else {
                buy_btn.innerText = 'Купить';
                buy_btn.addEventListener('click', () => {
                    if(basket) {
                        let prods = JSON.parse(basket);
                        prods.push(product._id);
                        sessionStorage.setItem('basket', JSON.stringify(prods));
                    } else {
                        let prods = [];
                        prods.push(product._id);
                        sessionStorage.setItem('basket', JSON.stringify(prods));
                    }
                    buy_btn.innerText = 'В корзине';
                    basket = sessionStorage.getItem('basket');
                    basket_length.innerText = JSON.parse(basket).length;
                    buy_btn.setAttribute('disabled','');
                });
        
            }
    
        } else {
            buy_btn.innerText = 'Купить';
                buy_btn.addEventListener('click', () => {
                    if(basket) {
                        let prods = JSON.parse(basket);
                        prods.push(product._id);
                        sessionStorage.setItem('basket', JSON.stringify(prods));
                    } else {
                        let prods = [];
                        prods.push(product._id);
                        sessionStorage.setItem('basket', JSON.stringify(prods));
                    }
                    buy_btn.innerText = 'В корзине';
                    basket = sessionStorage.getItem('basket');
                    basket_length.innerText = JSON.parse(basket).length;
                    buy_btn.setAttribute('disabled','');
                });
        }
        price_block.append(buy_btn);
        new_block.append(block);
    });
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