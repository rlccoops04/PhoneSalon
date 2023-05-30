const modal = document.querySelector('.modal'),
      modal_edit_product = document.querySelector('.modal_edit_product'),
      modal_create_product = document.querySelector('.modal_create_product'),
      open_modal_btn = document.querySelector('.open_modal'),
      create_form = document.forms['create_product'],
      token = localStorage.getItem('token'),
      input_id = document.querySelector('.id'),
      input_newprice = document.querySelector('.newprice'),
      input_newamount = document.querySelector('.newamount'),
      save_btn = document.querySelector('.save'),
      content_main = document.querySelector('.content_main');
content_main.style.cssText = 'padding: 30px;display: flex;flex-wrap: wrap;'
open_modal_btn.addEventListener('click', () => {
    modal.classList.remove('hide');
    modal_create_product.classList.remove('hide');
});
save_btn.addEventListener('click',async () => {
    console.log(input_id.value);
    const price = input_newprice.value,
          available = input_newamount.value,
          id = input_id.value;
    const response = await fetch('/admin/put/product', {
        method: "PUT",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({price, available, id})
    });
    const newproduct = await response.json();
    if(response.ok) {
        location.reload();
    }
});
create_form.elements['submit'].value = 'Создать';
create_form.elements['submit'].addEventListener('click', async (e) => {
    const model_id = create_form.elements['models'].value,
          product_name = create_form.elements['product_name'].value,
          price = create_form.elements['price'].value;
    if(model_id && product_name && price) {
        const response = await fetch('/admin/post/product', {
            method: "POST",
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json',
                'Accept-Type' : 'application/json' 
            },
            body: JSON.stringify({model_id, product_name, price})
        });
        const model = await response.json();
    }
});
async function start() {
    const resp = await fetch('/admin/get/products', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    const products = await resp.json();
    products.forEach(product => {
        const block = document.createElement('div');
        const img = document.createElement('img');
        img.src = product.model.img;
        img.style.cssText = 'height: 200px;display: block;margin: 10px auto 30px auto;';
        block.append(img);
        const edit_btn = document.createElement('button');
        const remove_btn = document.createElement('button');
        remove_btn.innerText = 'Удалить';
        block.style.cssText = 'position: relative;margin-right: 100px;margin-bottom: 20px;width: 300px;min-height: 100px;border-radius: 5px;background-color: white;border: 1px solid rgb(200,200,200);box-shadow:5px 5px 5px gray;padding: 10px;font-size: 14px;';
        block.innerHTML += `Категория: ${product.name}<br>Модель: ${product.model.producer} ${product.model.name_model}<br>Цена: ${product.price} <br>Наличие: ${product.available}<BR>`;

        edit_btn.style.cssText = 'margin-top:10px;border:none;background:green;border-radius:5px;width:100px;color:white;height: 30px;';
        remove_btn.style.cssText = 'margin-left:50px;border:none;background:red;border-radius:5px;width:100px;color:white;height: 30px;';
        edit_btn.innerText = 'Изменить';
        edit_btn.addEventListener('click', () => {
            modal.classList.remove('hide');
            modal_edit_product.classList.remove('hide');
            input_newprice.value = product.price;
            input_newamount.value = product.available;
            input_id.value = product._id;
        });
        remove_btn.addEventListener('click',async () => {
            const response = await fetch('/admin/delete/product', {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Accept-Type' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({id: product._id})
            });
            if(response.ok) {
                block.remove();
            }
        });
        content_main.append(block);

        block.append(edit_btn);
        block.append(remove_btn);
    });
    const response = await fetch('/admin/get/models', {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Accept-Type' : 'application/json'
        }
    });
    let check;
    const models = await response.json();
    models.forEach(model => {
        check = true;
        products.forEach(product => {
            if(model._id == product.model._id) {
                check = false;
            }
        });
        if(check) {
            const opt = document.createElement('option');
            opt.value = model._id;
            opt.innerText = `${model.producer} ${model.name_model}`;
            create_form.elements['models'].append(opt);
    
        }
    });
}
start();
modal.addEventListener('click', (e) => {
    if(e.target == modal) {
        modal.classList.add('hide');
        modal_create_product.classList.add('hide');
        modal_edit_product.classList.add('hide');
    }
});