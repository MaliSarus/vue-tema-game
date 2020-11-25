<template>
    <div id="app">
        <Modal :players.sync="players" :resources.sync="resources" :opened.sync="openModal"/>
        <Game v-if="loading !== true" :map="map" :players.sync="players" :resources.sync="resources" :opened.sync="openModal"/>
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
            }
        },
        created() {
            this.firstFetch();
        }
    }
</script>

<style>

</style>
