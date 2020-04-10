const productForm = document.getElementById('productForm');

const { remote } = require('electron')  //conectar el archivo app.js con database.js y main.js
const main = remote.require('./main') 
//main.createProduct() //evento llama la funcion hello del main.js

const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productList = document.getElementById('productos');

// let cant = 0
let products = []
let editingStatus = false;
let editproductId = '';


productForm.addEventListener('submit' , async (e) =>{
    e.preventDefault();

    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }

    if(!editingStatus){
        const result = await main.createProduct(newProduct)
        console.log(result);
    }else{
        await main.updateProduct(editproductId, newProduct);
        editingStatus = false;
        editproductId = '';
    }
    
    productForm.reset();
    productName.focus();

    getProducts();
    getCantidad();
})

async function deleteProduct(id){
    const response = confirm('Confirmar eliminar producto')
    if(response){
        await main.deleteProduct(id)
        await getProducts();
        await getCantidad();
        productForm.reset();
        productName.focus();
    }
    return;
}

async function editProduct(id){
    const product = await main.getProductById(id);
    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description;

    editingStatus = true;
    editproductId = product.id;

    // await getProducts();
}

function renderProducts(products){
    productList.innerHTML= '';
    products.forEach(element => {
        productList.innerHTML += `
            <div class="card card-body my-2 animated bounceInLeft">
                 <h4>${element.name}</h4>
                 <p>${element.description}</p>
                 <h3>${element.price}</h3>
                 <div>
                    <button class="btn btn-danger" onclick="deleteProduct(${element.id})"> Eliminar <i class="fas fa-trash"></i> </button>
                    <button class="btn btn-info" onclick="editProduct(${element.id})"> Editar  <i class="fas fa-edit"></i></button>
                 </div>
            </div>
        `  
    });
}
const getProducts = async () =>{
    products = await main.getProducts();
    renderProducts(products);
}

function renderCantidad(cant){
    cant.forEach(element => {
        // console.log(element.Cantidad)
        document.getElementById('cantidad').innerHTML = element.Cantidad
    });
}


const getCantidad = async () =>{
    cant = await main.getCantidad();
    renderCantidad(cant);
}

async function init(){
    await getProducts();
    await getCantidad();
}
init();