const content = document.querySelector('.content_main'),
      token = localStorage.getItem('token'),
      sortby = document.querySelector('.sortby');
sortby.addEventListener('change', () => {
    if(sortby.value == 'customerup') {
        orders.sort((a,b) => a.customer > b.customer ? 1 : -1);
    }
    if(sortby.value == 'customerdown') {
        orders.sort((a,b) => a.customer < b.customer ? 1 : -1);
    }
    if(sortby.value == 'sumup') {
        orders.sort((a,b) => {
            let sum1 = 0,
                sum2 = 0;
            a.products.forEach(product => {
                sum1 += Number(product.price);
            });
            b.products.forEach(product => {
                sum2 += Number(product.price);
            })
            if(sum1 > sum2) {
                return 1;
            } else {return - 1;}
        });
    }
    if(sortby.value == 'sumdown') {
        orders.sort((a,b) => {
            let sum1 = 0,
                sum2 = 0;
            a.products.forEach(product => {
                sum1 += Number(product.price);
            });
            b.products.forEach(product => {
                sum2 += Number(product.price);
            })
            if(sum1 < sum2) {
                return 1;
            } else {return - 1;}});
    }
    if(sortby.value == 'statusup') {
        orders.sort((a,b) => a.status > b.status ? 1 : -1);
    }
    if(sortby.value == 'statusdown') {
        orders.sort((a,b) => a.status < b.status ? 1 : -1);
    }
    Show(orders);
});
let orders;
(async () => {
    const response = await fetch('/admin/get/orders', {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    })
    orders = await response.json();
    Show(orders);
})()
function Show(orders) {
    content.innerHTML = '';
    orders.forEach(order => {
        CreateRow(order);
    });
}
content.style.cssText = 'padding: 0 50px;';
function CreateRow(order) {
    let sum = 0;
    const block = document.createElement('div');
    block.style.cssText = 'border: 2px solid rgb(200,200,200);margin-top: 20px;padding: 10px;display:flex;position:relative;';
    const block_content = document.createElement('div');
    block_content.style.cssText = 'width:800px;';
    block_content.innerHTML += `Заказ <span style='font-weight:700'>№${order._id}</span><br>Заказчик: <span style='font-weight:700'>${order.customer.name}</span><br>Контактный телефон: <span style='font-weight:700'>${order.customer.tel}</span><br>Содержимое заказа: <br>`;
    order.products.forEach(product => {
        sum += Number(product.price);
        block_content.innerHTML += `• Категория: <span style='font-weight:700'>${product.name}</span>, модель: <span style='font-weight:700'>${product.model.producer} ${product.model.name_model}</span> ( ${product.price} р. )<br>`;
    });
    block_content.innerHTML += `Сумма заказа: ${sum}`;
    block.append(block_content);
    const block_status = document.createElement('div');
    block_status.style.cssText = 'display:flex;justify-content:center;align-items:center;font-size:18px;';
    block_status.innerHTML = `Статус заказа: ${order.status}`;
    const change_status_btn = document.createElement('button');
    change_status_btn.style.cssText = 'position: absolute;right:20px;bottom:10px;border:none;border-radius:5px;background-color:rgba(0,150,50,0.8);color:white;padding:5px 10px;';
    switch(order.status) {
        case 'В обработке':
            change_status_btn.innerText = 'Принято';
            break;
        case 'Принято':
            change_status_btn.innerText = 'В доставке';
            break;
        case 'В доставке':
            change_status_btn.innerText = 'Готов к получению';
            break;
        case 'Готов к получению':
            change_status_btn.innerText = 'Выдан';
            break;
        case 'Выдан':
            change_status_btn.style.display = 'none';
            break;
    }
    change_status_btn.addEventListener('click', async () => {
        if(confirm("Изменить статус заказа?")) {
            const response = await fetch('/admin/put/order/' + order._id, {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({status: change_status_btn.innerText})
            });
            if(response.ok) {
                location.reload();
            }
        }
    });
    block.append(change_status_btn);
    block.append(block_status);
    content.append(block);

}
async function AuthorizeStatus() {
    const menu_items = document.querySelectorAll('.menu_item');
    if(token) {
        const response = await fetch('/get/user', {
            method: "GET",
            headers: {
                'Accept-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
        const user = await response.json();
        console.log(user);
        if(user.roles[0] == 'Менеджер') {
            menu_items[2].remove();
        }
    }
}
AuthorizeStatus();