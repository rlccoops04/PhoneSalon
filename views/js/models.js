const modal = document.querySelector('.modal'),
      open_modal = document.querySelector('.open_modal'),
      modal_create = document.querySelector('.modal_create_model'),
      modal_edit = document.querySelector('.modal_edit_model'),
      create_model_form = document.forms['create_model'],
      edit_params = document.querySelector('.parameters_block_edit'),
      edit_model_form = document.forms['edit_model'],
      add_parameter_btn = document.querySelector('.add_parameter_btn'),
      modal_create_model = document.querySelector('.modal_create_model'),
      token = localStorage.getItem('token');
open_modal.addEventListener('click', () => {
    modal.classList.remove('hide');
    modal_create.classList.remove('hide');
});



modal.addEventListener('click', (e) => {
    if(e.target == modal) {
        modal.classList.add('hide');
        modal_create.classList.add('hide');
        modal_edit.classList.add('hide');
    }
})

add_parameter_btn.addEventListener('click' , (e) => {
    e.preventDefault();
    const inp_parameter = document.createElement('input');
    inp_parameter.setAttribute('name', 'parameter');
    inp_parameter.setAttribute('placeholder', 'Парамeтр');
    const inp_value = document.createElement('input');
    inp_value.setAttribute('name', 'parameter_value');
    inp_value.setAttribute('placeholder', 'Значение');
    add_parameter_btn.before(inp_parameter);
    add_parameter_btn.before(inp_value);
});
create_model_form.elements['submit'].addEventListener('click', (e) => {
    const producer = create_model_form.elements['producer'].value,
          name_model = create_model_form.elements['name_model'].value;
    let parameters = [];
    if(create_model_form.elements['parameter'].length > 1) {
        for(let i = 0; i < create_model_form.elements['parameter'].length; i++) {
            parameters.push({parameter_name: create_model_form.elements['parameter'][i].value, parameter_value: create_model_form.elements['parameter_value'][i].value});
        }
    } else {
        parameters.push({parameter_name: create_model_form.elements['parameter'].value, parameter_value: create_model_form.elements['parameter_value'].value});
    }
    const filedata = create_model_form.elements['filedata'];
    let f = filedata.files[0],
        fr = new FileReader();
    console.log(f);
    if(f && producer && name_model && parameters.length != 0) {
        fr.onload = async e => {
            const response = await fetch('/admin/post/model', {
                method: 'POST',
                headers: {
                    'Accept-Type' : 'application/json',
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({producer, name_model, parameters,img: e.target.result})
            });
        }
        fr.readAsDataURL(f);
    } else {
        console.log('Ошибка');
    }
})
edit_model_form.elements['submit'].addEventListener('click', async (e) => {
    const producer = edit_model_form.elements['producer'].value,
          name_model = edit_model_form.elements['name_model'].value,
          id = edit_model_form.elements['id'].value;
    console.log(edit_model_form.elements['parameter'].length > 1);
    let parameters = [];
    if(edit_model_form.elements['parameter'].length > 1) {
        for(let i = 0; i < edit_model_form.elements['parameter'].length; i++) {
            parameters.push({parameter_name: edit_model_form.elements['parameter'][i].value, parameter_value: edit_model_form.elements['parameter_value'][i].value});
        }
    } else {
        parameters.push({parameter_name: edit_model_form.elements['parameter'].value, parameter_value: edit_model_form.elements['parameter_value'].value});
    }
    const response = await fetch('/admin/put/model', {
        method: "PUT",
        headers: {
            'Authorization' : `Beaerer ${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({id,producer, name_model, parameters})
    })

});
const content_main = document.querySelector('.content_main');
content_main.style.cssText = 'padding: 30px;display: flex;flex-wrap: wrap;'
let models;
async function start() {
    const response = await fetch('/admin/get/models', {
        method: 'GET',
        headers: {
            'Accept-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    });
    models = await response.json();
    console.log(models);
    models.forEach(model => {
        console.log(model);
        const block = document.createElement('div');
        const img = document.createElement('img');
        img.src = model.img;
        img.style.cssText = 'height: 200px;display: block;margin: 10px auto 30px auto;';
        block.style.cssText = 'position: relative;margin-right: 100px;margin-bottom: 20px;width: 300px;min-height: 100px;border-radius: 5px;background-color: white;border: 1px solid rgb(200,200,200);box-shadow:5px 5px 5px gray;padding: 10px;font-size: 14px;';
        block.append(img);
        block.innerHTML += `Производитель: ${model.producer}<br>Название модели: ${model.name_model}<br>Характеристики:<br>`;
        model.parameters.forEach(parameter => {
            block.innerHTML += `${parameter.parameter_name} : ${parameter.parameter_value}<br>`;
        });
        const btn_block = document.createElement('div');
        block.append(btn_block);
        const edit_btn = document.createElement('button');
        edit_btn.style.cssText = 'height: 50px;width: 120px;border: none;border-radius: 5px;background-color: green;color:white;margin-right: 35px;margin-top: 20px;';
        edit_btn.innerText = 'Изменить';
        edit_btn.addEventListener('click', () => {
            modal.classList.remove('hide');
            modal_edit.classList.remove('hide');
            edit_model_form.elements['producer'].value = model.producer;
            edit_model_form.elements['name_model'].value = model.name_model;
            const id = model._id;
            edit_model_form.elements['id'].value = id;
            model.parameters.forEach(param => {
                const inp_name = document.createElement('input');
                inp_name.setAttribute('name', 'parameter');
                const inp_value = document.createElement('input');
                inp_value.setAttribute('name', 'parameter_value');
                inp_name.value = param.parameter_name;
                inp_value.value = param.parameter_value;
                edit_params.append(inp_name);
                edit_params.append(inp_value);
            });

        });
        btn_block.append(edit_btn);
        const remove_btn = document.createElement('button');
        remove_btn.innerText = 'Удалить';
        remove_btn.style.cssText = 'height: 50px;width: 120px;border: none;border-radius: 5px;background-color: red;color:white;';

        remove_btn.addEventListener('click', async () => {
            if(confirm(`Вы уверены, что хотите удалить модель ${model.producer} ${model.name_model}?`)) {
                const response = await fetch('/admin/delete/model', {
                    method: "DELETE",
                    headers: {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({id: model._id})
                });
    
            }
        });
        btn_block.append(remove_btn);
        content_main.append(block);
    });
}
start();