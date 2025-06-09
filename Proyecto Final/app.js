const toggleBtn = document.getElementById("toggleCarrito");
const dropdown = document.getElementById("carritoDropdown");
const listaCarrito = document.getElementById("carritoLista");
const comprar = document.getElementById("btn-comprar");
const total = document.getElementById("total");

let carrito = [];

let stock = [
  { nombre: "Intel Core I7 12700k", precio: 516499, stock: 5 },
  { nombre: "Gigabyte Rtx 4060", precio: 806031, stock: 5 },
  { nombre: "Motherboard B550", precio: 178999, stock: 5 },
  { nombre: "Ryzen 5 5600G", precio: 184999, stock: 5 },
  { nombre: "Gigabyte Rx 5500 Xt", precio: 349202, stock: 5 },
  { nombre: "Motherboard Asus A320", precio: 157578, stock: 5 },
  { nombre: `Thermaltake 750W GOLD`, precio: 193002, stock: 5 }
]

/* ---------------------- ACTUALIZAR STOCK --------------------- */

const renderStock = () => {
  const productos = document.getElementById("productos")
  for (producto in stock) {
    let Produ = stock[producto]
    let card = document.createElement("div")
    card.className = "estiloCard"
    let idSeguro = Produ.nombre.replace(/\s+/g, "-");
    card.innerHTML = `
            <img src="/img/${Produ.nombre}.png" height="100px", width="auto"> 
            <h2>${Produ.nombre}</h2>
            <p>$ ${Produ.precio}</p>
            <button class="btn-compra" id="btn-comprar-${idSeguro}">COMPRAR</button>
        `
    displayProductos.appendChild(card)
    card.querySelector(`#btn-comprar-${idSeguro}`).addEventListener("click", () => {
      const existingItem = carrito.find(item => item.nombre === Produ.nombre);
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        carrito.push({
          nombre: Produ.nombre,
          precio: Produ.precio,
          img: `/img/${Produ.nombre}`,
          cantidad: 1
        });
      }
      actualizarCarrito();
      Produ.stock -= 1;
      if (Produ.stock === 0) {
        stock = stock.filter(p => p.nombre !== Produ.nombre);
        displayProductos.innerHTML = "";
        renderStock();
      }
      console.log(`Producto agregado: ${Produ.nombre}`)
    })
  }
}

/* ---------------------- ACTUALIZAR CARRITO --------------------- */

const actualizarCarrito = () => {
  listaCarrito.innerHTML = "";
  total.innerHTML = "";
  let precioFinal = 0

  carrito.forEach(prod => {
    const li = document.createElement("li");
    li.textContent = `${prod.nombre} - $ ${prod.precio} | `;
    let idBtnSeguro = prod.nombre.replace(/\s+/g, "-");
    li.innerHTML += `<button id="restar-${idBtnSeguro}">-</button> ${prod.cantidad} <button id="sumar-${idBtnSeguro}">+</button>`
    listaCarrito.appendChild(li);
    precioFinal = precioFinal + prod.precio * prod.cantidad;
    const btnSumar = document.querySelector(`#sumar-${idBtnSeguro}`);
    const btnRestar = document.querySelector(`#restar-${idBtnSeguro}`);
    const stockItem = stock.find(item => item.nombre === prod.nombre);
    btnSumar.addEventListener("click", () => {
      if (stockItem.stock > 0) {
        stockItem.stock -= 1;
        prod.cantidad++;
        actualizarCarrito();
        if (stockItem.stock === 0) {
          stock = stock.filter(p => p.nombre !== prod.nombre);
          displayProductos.innerHTML = "";
          renderStock();
        }
      } else {
        alert("¡No hay más stock disponible!");
      }
    })
    btnRestar.addEventListener("click", () => {
      prod.cantidad--;
      let encontrar = stock.find(p => p.nombre === prod.nombre);
      if (!encontrar) {
        stock.push({
          nombre: prod.nombre,
          precio: prod.precio,
          stock: 1
        })
      } else {
        encontrar.stock += 1;
      }
      if (prod.cantidad <= 0) {
        carrito = carrito.filter(p => p.nombre !== prod.nombre);
      }
      actualizarCarrito();
      displayProductos.innerHTML = "";
      renderStock();
    })
  });

  if (carrito.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay nada aqui...";
    listaCarrito.appendChild(li);
    return;
  }

  const precioT = document.createElement("h4");
  precioT.textContent = `Total: $ ${precioFinal}`
  total.appendChild(precioT)
};

/* ---------------------- "COMPRAR" CARRITO --------------------- */

comprar.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
})

toggleBtn.addEventListener("click", () => {
  dropdown.classList.toggle("oculto");
});

renderStock()