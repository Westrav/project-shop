// Подсчет и установка общей стоимости
function setAllPrice(pri, cou, spanOption) {
    let price = String(pri * cou)
    let textPrice = price
    if (price > 999) {
        textPrice = ''
        let counter = 1
        for (let i = price.length - 1; i >= 0; i--) {
            textPrice += price[i]
            if (counter % 3 == 0) {
                textPrice += ' '
            }
            counter++;
        }
        textPrice = Array.from(textPrice).reverse().join('')
    }
    spanOption.textContent = textPrice + ' грн'
}
// Наведение на карточки
function mouseOverOnCard() {
    for (const card of cards) {
        card.onmouseover = (e) => {
            if (e.target.classList.contains('card_active') == false) {
                card.classList.add('card_active')
            } else {
                card.classList.remove('card_active')
            }
        }
    }
}
// Добавление карточек в корзину
function addInBasket(basket) {
    for (const btn of buyCards) {
        btn.onmousedown = (e) => {
            const price = e.target.parentElement.previousElementSibling.textContent
            const name_product = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent
            const img = e.target.parentElement.parentElement.previousElementSibling.src
            if (e.target.classList.contains('card_buy') == false) {
                btn.classList.add('card_buy')
                btn.textContent = 'В кошику'
                let clearPrice = ''
                for (const num of price) {
                    if (isNaN(Number(num)) == false && num != ' ') {
                        clearPrice += num
                    }
                }
                const created_product = { price: Number(clearPrice), name: name_product, img: img, count: 1 }
                basket.push(created_product)
            } else {
                btn.classList.remove('card_buy')
                btn.textContent = 'Купити'
                let find_product = basket.find((item) => item.name == name_product)
                basket.splice(basket.indexOf(find_product), 1)
            }
        }
    }
}
// Создание карточки товара
function createCard(product) {
    const cardBasket = document.createElement('card')
    cardBasket.classList.add('card_basket')
    const cardBasketImg = document.createElement('div')
    cardBasketImg.classList.add('basket_img')
    const img = document.createElement('img')
    const cardBasketInfo = document.createElement('div')
    cardBasketInfo.classList.add('card_basket_info')

    const basketInfo = document.createElement('div')
    basketInfo.classList.add('basket_info')

    const spanInfo = document.createElement('span')
    const buttonInfoDel = document.createElement('button')
    buttonInfoDel.classList.add('btn_info_del')
    buttonInfoDel.classList.add('basket_controller')
    const i = document.createElement('i')
    i.classList.add('fa-regular', 'fa-trash-can', 'basket_controller')

    const basketInfoInfo = document.createElement('div')
    basketInfoInfo.classList.add('basket_info_info')
    const spanInfoInfo = document.createElement('span')
    const spanInfoInfoTwo = document.createElement('span')

    const basketOption = document.createElement('div')
    basketOption.classList.add('card_basket_option')
    const divOption = document.createElement('div')
    const btnUp = document.createElement('button')
    btnUp.classList.add('basket_controller')
    const inputCount = document.createElement('input')
    const btnDown = document.createElement('button')
    btnDown.classList.add('basket_controller')

    const divSpan = document.createElement('div')
    const spanOption = document.createElement('span')

    productsBasket.prepend(cardBasket)
    cardBasket.append(cardBasketImg)
    cardBasketImg.append(img)
    img.src = product.img

    cardBasket.append(cardBasketInfo)
    cardBasketInfo.append(basketInfo)

    basketInfo.append(spanInfo)
    spanInfo.textContent = product.name
    basketInfo.append(buttonInfoDel)
    buttonInfoDel.append(i)

    cardBasketInfo.append(basketInfoInfo)
    basketInfoInfo.append(spanInfoInfo)
    spanInfoInfo.textContent = 'В наявності'
    basketInfoInfo.append(spanInfoInfoTwo)
    spanInfoInfoTwo.textContent = product.price + ' / шт.'

    cardBasketInfo.append(basketOption)
    basketOption.append(divOption)
    divOption.append(btnDown)
    btnDown.textContent = '-'
    divOption.append(inputCount)
    inputCount.value = product.count
    divOption.append(btnUp)
    btnUp.textContent = '+'

    basketOption.append(divSpan)
    divSpan.append(spanOption)
    setAllPrice(product.price, product.count, spanOption)
    return [buttonInfoDel, btnUp, btnDown, inputCount, cardBasket, spanOption]
}
// Открытие и закрытие корзины
function openCloseBasket() {
    btnBasket.forEach(btn=>btn.onclick = (e) => {
            e.stopPropagation()
            document.body.style.overflow = 'hidden'
            basketFluid.classList.toggle('open_basket')
            blockBasket.classList.toggle('open_basket')
            productsBasket.innerHTML = '';
            if (basket.length >= 1) {
                checkOutBasket.classList.add('add_basket_check_out_product')
            }
            for (const product of basket) {
                const data = createCard(product)
                controllersBasket(data, product);
            }
    })
    
    document.onclick = (e) => {
        if (blockBasket.contains(e.target) == false &&
            btnBasket.includes(e.target) == false &&
            !e.target.classList.contains('basket_controller') &&
            containerFluidPopUp.contains(e.target) == false
        ) {

            document.body.style.overflow = ''

            blockBasket.classList.remove('open_basket')
            basketFluid.classList.remove('open_basket')

            // basketFluid.classList.remove('pop_up_open')
            popUpProduct.classList.remove('pop_up_open')
            containerFluidPopUp.classList.remove('open_fluid_pop_up')
        }
    }

    BtnBasketBlock.onclick = () => {
        document.body.style.overflow = ''
        basketFluid.classList.toggle('open_basket')
        blockBasket.classList.toggle('open_basket')
    }
}
// Обработчик кнопок корзины checkOutBasket, btnCheckOutBasket
function controllersBasket(data, product) {
    const [buttonInfoDel, btnUp, btnDown, inputCount, cardBasket, spanOption] = data

    buttonInfoDel.onclick = () => {
        const idxDelProduct = basket.findIndex(productBasket => productBasket.name == product.name)
        const itemDel = basket[idxDelProduct];

        for(const card of cards){
            let cardName = card.lastElementChild.children[0].textContent
            if(cardName == itemDel.name){
                const cardBtn = card.lastElementChild.children[3].lastElementChild.previousElementSibling
                    cardBtn.classList.remove('card_buy')
                    cardBtn.textContent = 'Купити'
            }
        }

        basket.splice(idxDelProduct, 1)
        cardBasket.remove()
        
        if (basket.length == 0) {
            checkOutBasket.classList.remove('add_basket_check_out_product')
        }

    }
    btnUp.onclick = () => {
        product.count++
        setAllPrice(product.price, product.count, spanOption)
        inputCount.value = product.count
    }
    btnDown.onclick = () => {
        if (inputCount.value == 1) {
            btnDown.disabled = false
        } else {
            product.count--
            setAllPrice(product.price, product.count, spanOption)
            inputCount.value = product.count
        }
    }
    btnCheckOutBasket.onclick = () => {
        containerFluidPopUp.classList.toggle('open_fluid_pop_up')
        popUpProduct.classList.toggle('pop_up_open')
        blockBasket.classList.remove('open_basket')
        basketFluid.classList.remove('open_basket')
    }
}
// Обработчик нажатие на сердце
function clickHeard() {
    for (const heart of hearts) {
        heart.onclick = () => {
            heart.classList.toggle('fa-solid')
        }
    }
}
// Обработчик ввода данных в инпут поиска
function searchController() {
    searchInput.oninput = () => {
        for (const card of cards) {
            const name = card.firstElementChild.nextElementSibling.firstElementChild.textContent
            if (name.toLowerCase().startsWith(searchInput.value.toLowerCase()) == false) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        }
    }
}
function btnPopUpBasket() {

}
//Обрабочик окна ПопАп
function popUpProductMenu() {
    btnPopUpProduct.onclick = () => {
        containerFluidPopUp.classList.toggle('open_fluid_pop_up')
        popUpProduct.classList.remove('pop_up_open')

        inputName = inputNamePopUp.value
        inputPhone = inputPhonePopUp.value
        let sum = 0

        let textSend = `Заказчик: ${inputName}%0A`;
        textSend += `Номер телефона: ${inputPhone}%0A%0A`;
        basket.forEach((product) => {
            textSend += ` ${product.name}%0A${product.count} штук%0A${product.price} 1/шт%0A`
            let sumProduct = product.count * product.price
            sum += sumProduct
        })
        textSend += `Общий прайс:${sum}`;


        fetch(`https://api.telegram.org/bot6267013752:AAGoWSqGgaTxLKsX2xvTD8fuJ53f0vekwOc/sendMessage?chat_id=596654719&text=${textSend}`)
            .then((response) => {
                console.log(response)
            })
        inputNamePopUp.value = ''
        inputPhonePopUp.value = ''
    }
}
//Функция закрытия popupOrder
function closePopupOrder() {
    containerFluidPopUp.onclick = (e) => {
        if (e.target != popUpProduct && e.target != inputNamePopUp && e.target != inputPhonePopUp && e.target != btnPopUpProduct) {
            containerFluidPopUp.classList.toggle('open_fluid_pop_up')
            popUpProduct.classList.remove('pop_up_open')
        }
    }
}


//Выборка блоков верстки 
const btnBuy = document.querySelector('button')
const cards = document.querySelectorAll('.card')
const buyCards = document.querySelectorAll('.card_buttons button:nth-child(1)')
// const btnBasket = document.querySelector('.header_button button:nth-child(3)')
const btnBasket = Array.from(document.querySelectorAll('.header_button_basket'))
const blockBasket = document.querySelector('.basket')
const BtnBasketBlock = document.querySelector('.basket_header button')
const basketFluid = document.querySelector('.basket_fluid')
const productsBasket = document.querySelector('.products_basket')
const hearts = document.querySelectorAll('.fa-heart')
const search = document.querySelector('.search')
const searchFluid = document.querySelector('.search_fluid')
const searchMenu = document.querySelector('.menu_search')
const searchInput = document.querySelector('.search input')
const checkOutBasket = document.querySelector('.basket_check_out_product')
const btnCheckOutBasket = document.querySelector('.cheack_out_btn')
const popUpProduct = document.querySelector('.pop_up')
const btnPopUpProduct = document.querySelector('.pop_up_button')
const inputNamePopUp = document.querySelector('.pop_up_product_info input')
const inputPhonePopUp = document.querySelector('.pop_up_product_info .phone')
const containerFluidPopUp = document.querySelector('.container_fluid_pop_up')



const headerHeader = document.querySelector('.header_header')
const btnHeaderDiv = document.querySelector('.header_button')
const headerBar = document.querySelector('.header_pleace')


const orders = []
const basket = []

mouseOverOnCard()
addInBasket(basket)
openCloseBasket()
clickHeard()
searchController()
popUpProductMenu()
closePopupOrder()
