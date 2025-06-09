const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
let cart = []

// abrir o moda do carrinho
cartBtn.addEventListener("click", function(){
    UpdateCartModal()
    cartModal.style.display = "flex"
})

// Fechar Modal quando clicar Fora
cartModal.addEventListener("click", function(event){
    if (event.target == cartModal  ){
        cartModal.style.display = "none"
    }
})

//Fecha o Modal quando clicar no botão Fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//Adicionando item ao Carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton){
        const name  = parentButton.getAttribute("data-name")
        const price  = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})


//Função para Adicionar ao Carrinho.
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //se o item existir na lista, aumenta apenas a quantidade
        existingItem.quantity +=1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }    
    UpdateCartModal()

}




//Adicionando carrinho
function UpdateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="border-red-600" >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium">${item.name}</p>
                        <p>Qtd: ${item.quantity}</p>
                        <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                    </div>            
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)


    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// função para remover o item do carrinho.
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        //verificando se a quantidade é maior que 1
        if(item.quantity > 1){
            item.quantity -= 1;
            UpdateCartModal()
            return
        }

        //remove a posição da lista
        cart.splice(index, 1);
        UpdateCartModal()
                   
    }
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.inputValue;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//finalizar o pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestauranteOpen()
    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado, nosso atendimento é das 18h a 22h",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }


    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    //enviar o pedido para API do WhatsAPP
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} | `
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "11992272919"
    window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    cart = [];
    UpdateCartModal();


})



// verificar  a hora  e manipular o card horario
function checkRestauranteOpen(){
    const data  = new Date();
    const hora = data.getHours();
    return hora >= 1 && hora < 13;
    //retorna TRUE para a condição
}

//como está fora da função, o JavaScriptt já executa esses codigos.

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}



