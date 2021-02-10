var coursesCard     = document.querySelectorAll('.course__item')
var addToCartBtn    = document.querySelectorAll('.add-to-cart')
var cart            = document.querySelector('#cart tbody')
var clearCartBtn    = document.querySelector('#empty-cart')
var notif           = document.querySelector('.notifs')
let promotion       = false
let deletebtnlist = document.querySelectorAll('.remove-course')



// If variable doesn't exists, create it
if (localStorage.getItem('cartStockage') == null) {
    localStorage.setItem('cartStockage', '{}')
}

// Add courses to cart from localstorage, at load of the page
var cartStockage = JSON.parse(localStorage.getItem('cartStockage'))

Object.entries(cartStockage).forEach(([key, value]) => {
        addToCart(key, value)
});

// Add courses to cart from html
for (let i = 0; i < addToCartBtn.length; i++) {
    const btn = addToCartBtn[i];
    btn.addEventListener('click', () => {
        let cardId = btn.getAttribute('data-id')
        if (COURSES[cardId].stock > 0) {
   
            // Display the item in cart
            if (cartStockage[cardId] == null) {
                qte = 1
                cartStockage[cardId] = qte
                addToCart(cardId, qte)

                // Display notification
                displayNotifAdd(cardId)
            }

            // Increase item quantity in cart if there is enough stock
            else if (COURSES[cardId].stock > 1) {
                qte = cartStockage[cardId]
                qte++
                cartStockage[cardId] = qte
                document.getElementById(`quantity[${cardId}]`).innerHTML = `${qte}`
                updateCourseStock(cardId, cartStockage[cardId])

                // Display notification
                displayNotifAdd(cardId)
            }

            // Check if promotion is activable
            if (getCartAmount() >= 100 && promotion == false) {
                startPromotion()
                promotion = true
            }
            
            // Save cart data in localstorage
            localStorage.setItem('cartStockage', JSON.stringify(cartStockage))
    
            
        }
    })
}

// Save cart data in localstorage
localStorage.setItem('cartStockage', JSON.stringify(cartStockage))

function addToCart(id, qte) {
    let course = COURSES[id]
    let stock = cartStockage[id]

    if (course.stock > 0) {
        cart.insertAdjacentHTML('afterbegin', `
            <tr class="cart-course">
                <td><img src="img/courses/${course.img}" alt="${course.title} logo"></td>
                <td class="cart-course-title">${course.title}</td>
                <td>${course.initial_price}€</td>
                <td class="cart-course-qte" id="quantity[${id}]">${qte}</td>
                <td><img src="img/cross.png" class="remove-course" data-id="${id}" onclick="removeToCart(${id})" style="width:25px;height:auto;cursor:pointer"></td>
            </tr>
        `)
        deletebtnlist = document.querySelectorAll('.remove-course')
    
    
        // Check if promotion is activable
        if (getCartAmount() >= 100 && promotion == false) {
            startPromotion()
            promotion = true
        }

        // Update the stock of the course
        updateCourseStock(id, qte)
    }
}

// Change course stock after adding it to the cart
function updateCourseStock(id, qte) {
    COURSES[id].stock -= qte
    let stockSpan = coursesCard[id - 1].querySelector('.stock')
    console.log(COURSES[id].stock);
    stockSpan.innerHTML = COURSES[id].stock
} 

// Remove course from cart and localstorage 
function removeToCart(id) {
    cartcourselist = document.querySelectorAll('.cart-course')
    for (let i = 0; i < cartcourselist.length; i++) {
        const course = cartcourselist[i];
        let courseId = course.querySelector('.remove-course').getAttribute('data-id')
        

        if (courseId == id) {
            confirmRemoveToCart()
            cart.removeChild(cartcourselist[i])
            delete cartStockage[id]
            localStorage.setItem('cartStockage', JSON.stringify(cartStockage))
            displayNotifRemove(id)
        }
    }
    
}

// Clear the cart
function clearCart() {
    var cartCoursesList = document.querySelectorAll('.cart-course')

    for (let i = 0; i < cartCoursesList.length; i++) {
        const course = cartCoursesList[i];
        cart.removeChild(course)
    }
    confirmClearCart()
    displayNotifRemoveAll()

    // Update the localstorage
    window.location.reload()
    localStorage.setItem('cartStockage', '{}')
}

function confirmRemoveToCart() {
    var suppCourseCart = confirm("Voulez-vous supprimer ce(s) cours ?");
    if (suppCourseCart == false) {
        //removeToCart with confirmation popup
        removeToCart(id)
    }
    else {
        //cancel remove
    }
}
function confirmClearCart() {
    var suppCourseCart = confirm("Voulez-vous vider le panier ?");
    if (suppCourseCart == false) {
        //clearCart with confirmation popup  
        clearCart()
    }
    else {
        //cancel clear
    }
}
// Display notification when adding to the cart
function displayNotifAdd(cardId){
    // Apparition d'une notif quand tu ajoute un cours au panier
    notif.insertAdjacentHTML('afterbegin', `
    <div class="alert" style="background-color: #00B2BD;">
        <span class="alertaddcart"></span>
        ${COURSES[cardId].title} à été ajouté au panier !
    </div>
`)
    $('.alert').addClass("hide")

}
function getCartAmount() {
    let cartCourses = document.querySelectorAll('.cart-course')
    let total = 0

    for (let i = 0; i < cartCourses.length; i++) {
        // Get the price of the course
        const courseQte = parseInt(cartCourses[i].querySelector('.cart-course-qte').innerHTML)
        const courseTitle = cartCourses[i].querySelector('.cart-course-title').innerHTML
        const coursePrice = getCoursePrice(courseTitle)
        // Calcul the total amount
        const courseAmount = courseQte * coursePrice
        total += courseAmount
    }
    return total
}

function getCoursePrice(courseTitle) {
    let i = 1
    while(true) {
        if (COURSES[i].title == courseTitle) {
            break
        } else {
            i++
        }
    }
    return COURSES[i].initial_price
}

function displayNotifRemove(cardId){
    // Apparition d'une notif quand tu retire un cours du panier
    notif.insertAdjacentHTML('afterbegin', `
    <div class="alert" style="background-color: #E25241;">
        <span class="alertaddcart"></span>
        ${COURSES[cardId].title} à été retiré du panier !
    </div>
`)
    $('.alert').addClass("hide")
}

function displayNotifRemoveAll(){
    // Apparition d'une notif quand tu vide le panier
    notif.insertAdjacentHTML('afterbegin', `
    <div class="alert" style="background-color: #d03625;">
        <span class="alertaddcart"></span>
        Vous venez de vider votre panier !
    </div>
`)
    $('.alert').addClass("hide")
}

function displayNotifEmptyCart(){
    // Display a message when cart is empty
    notif.insertAdjacentHTML('afterbegin', `
    <div class="alert" style="background-color: #52be80;">
        <span class="alertaddcart"></span>
        Votre panier est vide !
    </div>
`)
    $('.alert').addClass("hide")
}

function cartIsEmpty(){
    cartcourselist = document.querySelectorAll('.cart-course')
    if (cartcourselist.length == 0){
        displayNotifEmptyCart()
    } else {
        window.location.href = 'form.html'
    }
}