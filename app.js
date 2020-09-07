window.onload = function () {
    const vm = new Vue({
        el: '#app',
        data: {
            produtos: [],
            produto: {},
            cart:[],
            alertMessage: "",
            alertStatus: false
        },
        filters: {
            numeroPreco(valor){
                if(Number.isInteger(valor)){
                    return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
                }

                return valor;

            }
        },
        computed:{
            totalCart(){
                let total = 0;
                if(this.cart.length){
                    this.cart.forEach(produto => {
                        total += produto.preco;
                    })
                }
                return total;
            }
        },
        methods: {

            getProducts() {
                this.produtos = [];

                fetch("./api/produtos.json")
                    .then(response => response.json())
                    .then(response => {
                        this.produtos = JSON.parse(JSON.stringify(response));
                    });
            },
            async getProduct(id){
                const response = await fetch('./api/'+id+'/dados.json');
                const data = await response.json();
                this.produto = await JSON.parse(JSON.stringify(data));
                $('#modalProduto').modal();
            },
            addCartItem(){
                this.produto.estoque --;
                const {id, nome, preco, img} = this.produto;
                this.cart.push( {id, nome, preco, img});
                this.showAlert(nome+" foi adicionado ao carrinho");
            },
            removeCartItem(index){
                this.cart.splice(index,1)

            },
            checkLocalStorage(){
                if(window.localStorage.cart){
                    this.cart = JSON.parse(window.localStorage.cart);
                }
            },
            showAlert(message){
                console.log(message);
                this.alertMessage = message;
                this.alertStatus = true;

                setTimeout(() =>{
                    this.alertStatus =false;
                },1500)
            },
            router(){
                const hash = document.location.hash;
                if(hash)
                    this.getProduct(hash.replace("#",""));
            },
            abrirModalCarrinho(){
                $('#modalCarrinho').modal();
            }

        },
        watch:{
            cart(){
                window.localStorage.cart = JSON.stringify(this.cart);
            },
            produto(){
                document.title = this.produto.nome || 'Nome produto';
                const hash = this.produto.id || '';

                history.pushState(null, null, `#${hash}`)
            }
        },
        mounted(){
            this.checkLocalStorage();
            this.getProducts();
            this.router();
        }
    })


}
