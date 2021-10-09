const API_URL =
  'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses'

function makeGETRequest(url) {
  return new Promise((resolve, reject) => {
    let xhr
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    // установить функцию на событие по изменению состоянию готовности
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve(xhr.responseText)
      }
    }
    xhr.open('GET', url, true)
    xhr.send()
  })
}

const app = new Vue({
  el: '#app',
  data: {
    userSearch: '',
    catalogUrl: '/catalogData.json',
    cartUrl: '/getBasket.json',
    showCart: false,
    cartItems: [],
    filtered: [],
    imgCart: 'https://placehold.it/50x100',
    goods: [],
    imgProduct: 'https://placehold.it/200x150',
  },
  methods: {
    addItem(element) {
      const promise = makeGETRequest(`${API_URL}/addToBasket.json`)
      promise.then((goods) => {
        let ans = JSON.parse(goods)
        if (ans.result === 1) {
          let productId = +element.id_product
          let find = this.cartItems.find(
            (product) => product.id_product === productId
          )
          if (find) {
            find.quantity++
          } else {
            let product = {
              id_product: productId,
              price: +element.price,
              product_name: element.product_name,
              quantity: 1,
            }
            this.cartItems.push(product)
          }
        } else {
          alert('Error')
        }
      })
    },
    removeItem(element) {
      const promise = makeGETRequest(`${API_URL}/deleteFromBasket.json`)
      promise.then((goods) => {
        let ans = JSON.parse(goods)
        if (ans.result === 1) {
          if (element.quantity > 1) {
            element.quantity--
          } else {
            this.cartItems.splice(this.cartItems.indexOf(element), 1)
          }
        } else {
          alert('Error')
        }
      })
    },
    filter() {
      const regexp = new RegExp(this.userSearch, 'i')
      this.filtered = this.goods.filter((product) =>
        regexp.test(product.product_name)
      )
    },
  },

  mounted() {
    const promise = makeGETRequest(`${API_URL}/catalogData.json`)
    promise.then((ans) => {
      jsonAns = JSON.parse(ans)
      for (let item of jsonAns) {
        this.goods.push(item)
        this.filtered.push(item)
      }
    })

    makeGETRequest(`getProducts.json`).then((ans) => {
      jsonAns = JSON.parse(ans)
      for (let item of jsonAns) {
        this.goods.push(item)
        this.filtered.push(item)
      }
    })
  },
})
