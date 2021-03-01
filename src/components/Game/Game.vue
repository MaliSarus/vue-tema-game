<template>
    <main>
        <div class="game-wrapper">
            <img :src="map" alt="" class="game-image">
            <div class="game-field" v-if="isAdmin">
                <div
                        ref="player"
                        v-for="(player, index) in playersData"
                        class="player"
                        :key="'player_' + index"
                        :data-index="index"
                        v-draggabilly="{containment: true}"
                        :style="{
                            left: player.position.left,
                            top: player.position.top
                        }"
                        v-draggabilly-on:dragEnd="()=>dragEnd('player',index)"
                        v-draggabilly-on:staticClick="()=>staticClick('player', index)"
                        :class="{
                            'player_1-4': player.number >= 1 && player.number <= 4,
                            'player_5-8': player.number >= 5 && player.number <= 8,
                            'player_9-12': player.number >= 9 && player.number <= 12,
                            'player_13-16': player.number >= 13 && player.number <= 16,
                            'player_17-20': player.number >= 17 && player.number <= 20
                        }"
                >
                    {{player.number}}
                </div>
                <div
                        v-for="(resource, index) in resourcesData"
                        class="resource"
                        :key="'resource_' + index"
                        :data-index="index"
                        ref="resource"
                        v-draggabilly="{containment: true}"
                        :style="{
                            left: resource.position.left,
                            top: resource.position.top
                        }"
                        :class="`resource_${resource.color}`"
                        v-draggabilly-on:dragEnd="()=>dragEnd('resource',index)"
                        v-draggabilly-on:staticClick="()=>staticClick('resource', index)"
                />
            </div>
            <div class="game-field" v-else>
                <div

                        v-for="(player, index) in playersData"
                        class="player player_static"
                        :key="'player_static_' + index"
                        :style="{
                            left: player.position.left,
                            top: player.position.top
                        }"
                        :class="{
                            'player_1-4': player.number >= 1 && player.number <= 4,
                            'player_5-8': player.number >= 5 && player.number <= 8,
                            'player_9-12': player.number >= 9 && player.number <= 12,
                            'player_13-16': player.number >= 13 && player.number <= 16,
                            'player_17-20': player.number >= 17 && player.number <= 20
                        }"
                >
                    {{player.number}}
                </div>
                <div
                        v-for="(resource, index) in resourcesData"
                        class="resource resource_static"
                        :key="'resource_static_' + index"
                        :data-index="index"
                        :class="`resource_${resource.color}`"
                        :style="{
                            left: resource.position.left,
                            top: resource.position.top
                        }"
                />
            </div>
        </div>
        <div v-if="!isAdmin" class="admin">
            <button class="admin-login" @click="formOpen = !formOpen">Я ведущий</button>
            <form v-if="formOpen" action="" @submit.prevent="adminCheck">
                <input type="password" class="admin-password active" placeholder="введите пароль"
                       v-model="adminCheckPass" @input="adminPassInput">
            </form>
            <div v-show="wrongPass" class="wrong-pass active">Неправильный пароль, попробуйте еще раз</div>
        </div>

        <div v-else class="game-controls active">
            <button class="call-modal" @click="openModal">Добавить</button>
            <button class="clear" @click="clearField">Очистить</button>
            <button class="logout" @click="logout">Выйти из режима ведущего</button>
        </div>
    </main>
</template>

<script>
    import axios from "axios";
    import {sendData} from "@/helpers/data-transfer";

    export default {
        name: "Game",
        props: ['map', 'players', 'resources', 'opened', 'admined', 'gameId'],
        data() {
            return {
                loading: false,
                adminCheckPass: '',
                adminPass: '12345',
                wrongPass: false,
                formOpen: false,
                isAdmin: this.admined,
                dbClickCounter: 0,
            }
        },
        computed: {
            playersData: {
                get() {
                    return this.players
                },
                set(value) {
                    this.$emit('update:players', value)
                }
            },
            resourcesData: {
                get() {
                    return this.resources
                },
                set(value) {
                    this.$emit('update:resources', value)
                }
            },
        },
        methods: {
            logout() {
                this.isAdmin = false,
                this.$emit('logout')
            },
            adminPassInput() {
                this.wrongPass = false;
            },
            adminCheck() {
                if (this.adminCheckPass == this.adminPass) {
                    this.isAdmin = true;
                    localStorage.setItem('is_admin', 'true');
                    localStorage.setItem('adminExpiration', new Date().getTime() + 100000);
                    clearInterval(window.checkInterval);
                } else {
                    this.wrongPass = true
                }
            },

            clearField(){
                this.playersData = [];
                this.resourcesData = [];
                sendData(this.gameId,[], [])
            },
            staticClick(type, index){
                this.dbClickCounter += 1;
                setTimeout(function () {
                    this.dbClickCounter = 0
                }, 300);
                if (this.dbClickCounter >= 2) {
                    switch (type) {
                        case 'player': {
                            this.playersData.splice(index, 1);
                            this.dbClickCounter = 0
                            break;
                        }
                        case 'resource': {
                            this.resourcesData.splice(index, 1);
                            this.dbClickCounter = 0
                            break;
                        }
                        default:
                            break;
                    }

                    sendData(this.gameId,this.playersData, this.resourcesData)
                }
            },

            elementPercPosition(element) {
                // const leftPerc = ($(element).offset().left - $('.game-field').offset().left) / $('.game-field').width() * 100 + '%';
                // const topPerc = ($(element).offset().top - $('.game-field').offset().top) / $('.game-field').height() * 100 + '%';
                const gameField = document.querySelector('.game-field');
                const elementRect = element.getBoundingClientRect();
                const gameFieldRect = gameField.getBoundingClientRect();
                const leftPerc = (elementRect.left - gameFieldRect.left) / gameField.offsetWidth * 100 + '%';
                const topPerc = (elementRect.top - gameFieldRect.top) / gameField.offsetHeight * 100 + '%';


                return {
                    leftPerc,
                    topPerc
                }
            },
            playerDrag(index) {
                const player = this.$refs.player[index]
                const position = this.elementPercPosition(player)
                player.style.left = position.leftPerc;
                player.style.top = position.topPerc;
                this.playersData[index].position.left = position.leftPerc;
                this.playersData[index].position.top = position.topPerc;
            },
            resourceDrag(index) {
                const resource = this.$refs.resource[index]
                const position = this.elementPercPosition(resource)
                resource.style.left = position.leftPerc;
                resource.style.top = position.topPerc;
                this.resourcesData[index].position.left = position.leftPerc;
                this.resourcesData[index].position.top = position.topPerc;
            },
            dragEnd(type, index) {
                switch (type) {
                    case 'player': {
                        this.playerDrag(index)
                        break;
                    }
                    case 'resource': {
                        this.resourceDrag(index)
                        break;
                    }
                    default:
                        break;
                }

                sendData(this.gameId,this.playersData, this.resourcesData)
            },

            openModal() {
                this.$emit('update:opened', true)
            },
        },
    }
</script>

<style scoped>

</style>