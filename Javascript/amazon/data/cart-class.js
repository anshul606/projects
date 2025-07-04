class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }
    #loadFromStorage(){
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
    }

    saveToStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(cart));
    }

    addToCart(productId) {
        let matchingItem;
            this.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                matchingItem = cartItem;
                }
        });

        if (matchingItem) {
            matchingItem.quantity += 1;
        } else {
            this.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: 1 // Default delivery option
            });
        }

        this.saveToStorage();
    }

    removeFromCart(productId){
        const newCart = [];
        this.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
            newCart.push(cartItem);
            }
        });

        this.cartItems = newCart;

        this.saveToStorage();
    };

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        this.forEach((cartItem) => {
            if (productId === cartItem.productId) {
            matchingItem = cartItem;
            }
        });

        matchingItem.deliveryOptionId = Number(deliveryOptionId);

        this.saveToStorage();
    };

}
const cart = new Cart('cart-oop');
const businessCart = new Cart('business-cart-oop');

console.log(cart);
console.log(businessCart);





