const open_catalog_btn = document.querySelector('.open_catalog'),
      strips = document.querySelectorAll('.strip'),
      catalog = document.querySelector('.main_block_catalog'),
      login_btn = document.querySelector('.login_btn'),
      modal = document.querySelector('.modal'),
      token = localStorage.getItem('token'),
      basket_length = document.querySelector('.basket_length'),
      content = document.querySelector('.main_content_right'),
      login_form = document.forms['login_form'],
      inp_min_price = document.querySelector('.inp_min_price'),
      inp_max_price = document.querySelector('.inp_max_price');
let basket = sessionStorage.getItem('basket');
if(basket) {
    basket_length.innerText = JSON.parse(basket).length;
}
inp_min_price.addEventListener('blur', () => {
    if(searched.length == 0) {
        searched = smartphones.filter(phone => Number(phone.price) > Number(inp_min_price.value));
    } else {
        searched = searched.filter(phone => Number(phone.price) > Number(inp_min_price.value));
    }
    ShowPhones(searched);
});
inp_max_price.addEventListener('blur', () => {
    if(searched.length == 0) {
        searched = smartphones.filter(phone => Number(phone.price) < Number(inp_max_price.value));
    } else {
        searched = searched.filter(phone => Number(phone.price) < Number(inp_max_price.value));
    }
    ShowPhones(searched);
});
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

function ShowPhones(smartphones) {
    content.innerHTML = ``;
    smartphones.forEach(product => {
        const block = document.createElement('div');

        block.style.cssText = 'width: 368px;min-height: 400px;border: 0.5px solid rgb(230,230,230);padding: 20px;padding-bottom:50px;border-right: none;cursor: pointer';
        block.addEventListener('mouseenter', () => {
            block.style.boxShadow = '5px 5px 10px gray';
        });
        block.addEventListener('mouseleave', () => {
            block.style.boxShadow = 'none';
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
                });
        }
        price_block.append(buy_btn);
        content.append(block);
        block.addEventListener('click', (e) => {
            if(e.target != buy_btn) {
                window.location.href = `/product/${product._id}`;
            }
        });
    });
}
let searched = [];
let smartphones;
async function start() {
    const response = await fetch('/get/products/smartphones', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    smartphones = await response.json();
    const producer_block = document.querySelector('.main_content_left_producer_content');
    smartphones.forEach(phone => {
        if(!producer_block.innerHTML.includes(phone.model.producer)) {
            const prod = document.createElement('div');
            prod.innerText = phone.model.producer;
            producer_block.append(prod);
            prod.style.cssText = 'background-color: rgb(239, 237, 237);padding: 5px 10px;border-radius: 5px;margin-right: 15px;margin-bottom: 10px;cursor: pointer;';
            prod.addEventListener('click', () => {
                if(prod.style.backgroundColor == 'gray') {
                    prod.style.backgroundColor = 'rgb(239, 237, 237)';
                    prod.style.color = 'black';
                    searched = searched.filter(phone => phone.model.producer != prod.innerText);
                    console.log(searched.length);
                    if(searched.length == 0) {
                        searched = smartphones;
                        ShowPhones(smartphones);
                    } else {
                        ShowPhones(searched);

                    }
                } else {
                    prod.style.backgroundColor = 'gray';
                    prod.style.color = 'white';
                    const search = smartphones.filter(phone => phone.model.producer == prod.innerText);
                    searched = searched.concat(search);
                    ShowPhones(searched);
                }
            });
        }
    });
    ShowPhones(smartphones);
}
start();


const smartphone = document.querySelector('.smartphones');
smartphone.addEventListener('click', () => {
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
    window.location.href = '/basket';
});