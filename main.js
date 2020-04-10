const {BrowserWindow, Notification} = require('electron')
const {getConnection} = require('./database')




async function createProduct(product){
    try {
        const conn = await getConnection();
        //convierto el de string a float
        product.price = parseFloat(product.price)
        //Se utiliza el "formato" de sql normal SELET, INSERT, etc.
        const result = await conn.query('INSERT INTO product SET ?', product )
        // console.log(result)

        new Notification({
            title: 'Electron CRUD MySQL',
            body: 'Producto guardado con exitoso',
            subtitle: 'verificar en la BDD',
            timeoutType: 'default'
        }).show();

        product.id = result.insertId;
        return product

    }catch (error){
        new Notification({
            title: 'Electron CRUD MySQL',
            body: 'No se envio los datos'+'\n'+ error,
            subtitle: 'verificar en la BDD',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
}

async function getProducts(){
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM product ORDER BY id DESC')
    // const results = await conn.query('SELECT COUNT(*) FROM product');
    console.log(results)
    return results;
}

async function getCantidad(){
    const conn = await getConnection();
    const result = await conn.query('SELECT COUNT(*) AS Cantidad FROM product')
    // const result = await conn.query('SELECT COUNT(*) FROM product')
    console.log(result)
    return result;
}

async function deleteProduct(id){
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id = ?', id)
    console.log(result); 
}

async function getProductById(id){
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM product WHERE id = ?', id)
    return result[0]; 
}

async function updateProduct(id, product){
    const conn = await getConnection();
    const result = await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);
    // return result
    console.log(result)
}

let window
function createWindow(){
    window = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences:{
            nodeIntegration: true
        }
    })
    window.loadFile('vistas/index.html');
}

module.exports = {
    createWindow,
    createProduct,
    getProducts,
    getCantidad,
    deleteProduct,
    getProductById,
    updateProduct
};