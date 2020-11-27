var productos = document.getElementById('arrayProductos').innerText;
var carro = document.getElementById('arrayCarro');
carro = JSON.parse(carro.innerText);
productos = JSON.parse(productos);
//Declaro la clase producto
class ProductoCarrito {
    constructor(nombre, precio, img, cant = 1) {
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cant = cant;
        this.precioFinal = this.precio * this.cant;
    }
    aumentarCantidad() {
        this.cant++;
    }
    actualizarPrecio() {
        this.precioFinal = this.precio * this.cant;
    }
    setCantidad(c) {
        this.cant = c;
    }
}

var arrayCarrito = [];

//Declaracion de variables que almacenaran los elementos DOM que vamos a necesitar

var botonMiCarrito = document.getElementsByClassName(
    'boton-mostrar-carrito'
)[0];

var carrito = document.getElementsByClassName('carrito')[0];

var productosCarrito = document.getElementsByClassName('productos-carrito')[0];

var botonEliminarDeCarrito = document.getElementsByClassName(
    'boton-eliminar-carrito'
);

var cantidadProductoCarrito = document.getElementsByClassName(
    'cantidad-producto-carrito'
);

var botonAniadirCarrito = document.getElementsByClassName('boton-add-carrito');

var barraBusqueda = document.querySelector('.header-busqueda');

var botonCerrarCarritoHeader = document.querySelector(
    '.boton-cerrar-carrito-header'
);

var inputArrayCarrito = document.getElementById('input-array-carrito');
var inputPrecioTotal = document.getElementById('precioTotalCarrito');

var productos = document.querySelectorAll('.carta-producto');

//Script para barra de busqueda
barraBusqueda.addEventListener('keyup', (e) => {
    let valorBusqueda = e.target.value.replaceAll(' ', '').toLowerCase();
    productos.forEach((element) => {
        var titulo = element
            .querySelector('.titulo-producto')
            .innerText.replaceAll(' ', '')
            .toLowerCase();
        if (titulo.includes(valorBusqueda)) {
            element.classList.remove('escondido');
        } else {
            element.classList.add('escondido');
        }
    });
});

//Eventos para cerrar el carrito.

botonMiCarrito.addEventListener('click', () => {
    carrito.classList.toggle('carrito-escondido');
});
botonCerrarCarritoHeader.addEventListener('click', () => {
    carrito.classList.add('carrito-escondido');
});

//Compruebo si me llega un carro desde otra pagina,
//si llega, creo un objeto ProductoCarrito para cada uno de ellos

if (carro.length > 0) {
    carro.forEach((p) => {
        var obj = new ProductoCarrito(p.nombre, p.precio, p.img, p.cant);
        arrayCarrito.push(obj);
        addProductoACarrito(obj);
        actualizarProductosCarrito();
        carrito.classList.remove('carrito-escondido');
    });
}

//Aqui añado eventos al boton de añadir al carrito de cada producto,
//recojo tambien su precio y nombre e imagen.
//Luego con array some() y array index() compruebo si el producto ya esta en el carrito,
//si lo está, aumentamos la cantidad de dicho producto, si no lo está, creamos un objeto carrito
//con dicho producto y lo añadimos al array de carrito, tambien remuevo la clase "carrito-escondido"
//para mostrar el carrito
for (let i = 0; i < botonAniadirCarrito.length; i++) {
    botonAniadirCarrito[i].addEventListener('click', (e) => {
        var producto = e.target.parentElement.parentElement;
        var nombre = producto.children[1].innerText;
        var precio = producto.children[2].firstElementChild.innerText;
        precio = parseInt(precio.replace('$', ''));
        var img = producto.children[0].getAttribute('src');

        if (arrayCarrito.some((producto) => producto.nombre == nombre)) {
            arrayCarrito[
                arrayCarrito.findIndex((p) => p.nombre == nombre)
            ].aumentarCantidad();
            arrayCarrito[
                arrayCarrito.findIndex((p) => p.nombre == nombre)
            ].actualizarPrecio();
            actualizarProductosCarrito();
        } else {
            pCarrito = new ProductoCarrito(nombre, precio, img);
            arrayCarrito.push(pCarrito);
            addProductoACarrito(pCarrito);
            actualizarProductosCarrito();
            carrito.classList.remove('carrito-escondido');
        }
    });
}
//Esta funcion se engarga de recorrer el carrito, recoge los precios de los productos y
//la cantidad, entonces calcula el total de todos los productos en el carrito, y actualiza el
//elemento html donde se visualiza el total
//Esta funcion siempre la llamo cuando cambio algo en el array del carrito, para actualizar el total de inmediato
function actualizarProductosCarrito() {
    var productoCarrito = document.getElementsByClassName('producto-carrito');
    var precioTotalCarrito = document.getElementById('precio-total-carrito');
    var totalCarrito = 0;

    for (let i = 0; i < productoCarrito.length; i++) {
        var nombre =
            productoCarrito[i].lastElementChild.firstElementChild.innerText;
        var prod = arrayCarrito.find((p) => p.nombre == nombre);
        totalCarrito += prod.precioFinal;
        productoCarrito[i].lastElementChild.lastElementChild.innerText =
            '$' + prod.precioFinal;
        productoCarrito[i].lastElementChild.getElementsByClassName(
            'cantidad-producto-carrito'
        )[0].value = prod.cant;
    }
    precioTotalCarrito.innerText = '$' + totalCarrito;
    inputArrayCarrito.setAttribute('value', JSON.stringify(arrayCarrito));
    inputPrecioTotal.setAttribute('value', totalCarrito);
}

//Esta funcion se engarga de añadir un elemento al div correspondiente en el carrito,
//recibe un objeto de tipo ProductoCarrito y creamos el innerHTML usando las variables del objeto
//y lo añadimos al div del carrito
function addProductoACarrito(producto) {
    var div = document.createElement('div');
    var prod = `
  <div id="div" class="producto-carrito">
              <img class="imagen-producto-carrito" src="${producto.img}" />
              <div class="detalles-producto-carrito">
                <span class="titulo-producto-carrito"
                  >${producto.nombre}</span
                >
                <div class="eliminar-cantidad">
                  <span>Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    class="cantidad-producto-carrito"
                    value="1"
                  />
                  <button class="boton-eliminar-carrito">X</button>
                </div>
                <span class="precio-producto-carrito">$${producto.precioFinal}</span>
              </div>
            </div>
  `;
    div.innerHTML = prod;

    var cantidadProducto = div.firstElementChild.getElementsByClassName(
        'cantidad-producto-carrito'
    )[0];

    botonEliminarDeCarrito = div.getElementsByClassName(
        'boton-eliminar-carrito'
    )[0];
    //Una vez añadido el elemento al dom, es aqui donde tenemos que añadir los event listeners de los objetos del carrito
    // ya que si lo intentamos añadir fuera de esta funcion, no tendra efecto ya que los elementos no
    //existe hasta que el usuario añade el producto al carrito
    //Asi que aqui añado event listener al input de la cantidad de producto y al boton de eliminar producto de carrito

    cantidadProducto.addEventListener('change', (e) => {
        var cant = cantidadProducto.value;
        var prodCarrito =
            arrayCarrito[
                arrayCarrito.findIndex((p) => p.nombre == producto.nombre)
            ];
        prodCarrito.setCantidad(cant);
        prodCarrito.actualizarPrecio();
        actualizarProductosCarrito();
        console.log('Camiado valor carrito a ' + cant);
    });

    botonEliminarDeCarrito.addEventListener('click', (e) => {
        var indice = arrayCarrito.findIndex((p) => p.nombre == producto.nombre);
        e.target.parentElement.parentElement.parentElement.remove();
        arrayCarrito.splice(indice, 1);
        actualizarProductosCarrito();
    });

    productosCarrito.append(div);
}

//Por ultimo tenemos la funcion validar, que se encargar de validar el fomulario de contacto que hay en el footer,
//hago uso de expresiones regulares comunes para comprobar el email, el numero de telefono, y el nombre,
//que debera tener entre 3 y 16 caracteres

function validar() {
    let form = document.contacto;
    let valido = true;

    if (!/(^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,16})+$/.test(form.nombre.value)) {
        form.nombre.style.border = '2px solid red';
        valido = false;
    }
    if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email.value)
    ) {
        form.email.style.border = '2px solid red';
        valido = false;
    }
    if (
        !/^\(?([\d]{3})\)?[-.]?([\d]{3})[-.]?([\d]{3})$/.test(
            form.telefono.value
        )
    ) {
        form.telefono.style.border = '2px solid red';
        valido = false;
    }
    if (valido) {
        document.getElementById('contacto').submit();
    }
}
