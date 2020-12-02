<template>
    <div id="app">
        <Modal :players.sync="players" :resources.sync="resources" :opened.sync="openModal"/>
        <Game v-if="loading !== true" :map="map" :players.sync="players" :resources.sync="resources"
              :opened.sync="openModal" :admined="admined" @logout="logout"/>
    </div>
</template>

<script>

    import Modal from "@/components/Modal/Modal";
    import Game from "@/components/Game/Game";
    import axios from 'axios'

    export default {
        name: 'App',
        components: {Game, Modal},
        data() {
            return {
                admined: false,
                resources: [],
                players: [],
                map: null,
                openModal: false,
                loading: true,
            }
        },
        methods: {
            firstFetch() {
                axios
                    .get(
                        '/check.php', {
                            params: {
                                game_id: 'R3obG8hy4O'
                            }
                        }
                    )
                    .then(response => {
                        console.log(response)
                        const data = response.data.data;
                        const content = JSON.parse(data.content);
                        this.map = 'http://send.flowgate.ru/' + data.image;
                        content.resources ?
                            this.resources = content.resources
                            : [];
                        content.players ?
                            this.players = content.players
                            : [];
                        this.loading = false;
                    });
            },
            intervalFetch(){
                axios
                    .get(
                        '/check.php', {
                            params: {
                                game_id: 'R3obG8hy4O'
                            }
                        }
                    )
                    .then(response => {
                        console.log(response)
                        const data = response.data.data;
                        const content = JSON.parse(data.content);
                        content.resources ?
                            this.resources = content.resources
                            : [];
                        content.players ?
                            this.players = content.players
                            : [];
                    });
            },
            logout() {
                localStorage.removeItem('is_admin');
                localStorage.removeItem(('adminExpiration'))
                this.admined = false;
                const vue = this
                window.checkInterval = setInterval(function (){
                    vue.intervalFetch();
                }, 5000)
            }
        },
        created() {
            let lsAdmin = localStorage.getItem('is_admin');
            let expirationDate = localStorage.getItem('adminExpiration');
            this.firstFetch();
            const vue = this;
            if (lsAdmin === 'true') {
                if (new Date().getTime() > +expirationDate) {
                    localStorage.removeItem('is_admin');
                    localStorage.removeItem(('adminExpiration'));
                    this.admined = false;
                    window.checkInterval = setInterval(function (){
                        vue.intervalFetch();
                    }, 5000)
                } else {
                    this.admined = true;
                }
            }
            else {
                this.admined = false;
                window.checkInterval = setInterval(function (){
                    vue.intervalFetch();
                }, 5000)
            }
        }
    }
</script>

<style>

</style>
