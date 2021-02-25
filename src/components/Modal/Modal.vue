<template>
    <div class="modal" :class="{open: opened}">
        <div class="modal__block ">
            <div class="modal__close" @click="closeModal"></div>
            <form action="#" class="players-form" @submit.prevent="addPlayers">
                <label for="player-num">Выберите номер игрока</label>
                <select name="player" id="player-num" v-model="playerNum">
                    <option v-for="num in playersNum" :value="num.number" :key="'option_' + num.number"
                            :disabled="num.disabled">{{num.number}}
                    </option>
                </select>
                <input type="number" min="1" max="3" value="1" v-model="playerCount">
                <button type="submit">Добавить игрока</button>
            </form>
            <form action="#" class="resources-form" @submit.prevent="addResources">
                <div>Выберите цвет фишки ресурса и его кол-во</div>
                <div class="resources">
                    <label :class="{checked: resource.color == '#FFCC00'}" for="resource-1"
                           style="background-color: #FFCC00">
                        <input type="radio" name="resource" value="#FFCC00" id="resource-1"
                               v-model="resource.color">
                    </label>
                    <label :class="{checked: resource.color == '#FF9933'}" for="resource-2"
                           style="background-color: #FF9933">
                        <input type="radio" name="resource" value="#FF9933" id="resource-2"
                               v-model="resource.color">
                    </label>
                    <label :class="{checked: resource.color == '#FF3366'}" for="resource-4"
                           style="background-color: #FF3366">
                        <input type="radio" name="resource" value="#FF3366" id="resource-4"
                               v-model="resource.color">
                    </label>
                    <label :class="{checked: resource.color == '#6666FF'}" for="resource-6"
                           style="background-color: #6666FF">
                        <input type="radio" name="resource" value="#6666FF" id="resource-6"
                               v-model="resource.color">
                    </label>
                    <label :class="{checked: resource.color == '#964b00'}" for="resource-9"
                           style="background-color: #964b00">
                        <input type="radio" name="resource" value="#964b00" id="resource-9"
                               v-model="resource.color">
                    </label>
                </div>
                <input type="number" min="1" value="1" v-model="resource.count">
                <button type="submit">Добавить ресурс</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Modal",
        data() {
            return {
                playerNum: '',
                playerCount: 1,
                resource: {
                    color: '',
                    count: 1
                }
            }
        },
        props: ['resources', 'players', 'opened'],
        computed: {
            resourcesData: {
                get() {
                    return this.resources
                },
                set(val) {
                    this.$emit('update: resources')
                }
            },
            playersData: {
                get() {
                    return this.players
                },
                set(val) {
                    this.$emit('update: players')
                }
            },
            playersNum() {
                const numbers = [];
                for (let i = 1; i <= 20; i++) {
                    const number = {
                        number: i,
                        disabled: this.playersData.filter(player => player.number == i).length >= 3
                    }
                    numbers.push(number)
                }
                return numbers
            }
        },
        methods: {
            addPlayers() {
                if (this.playerNum) {
                    for (let i = 0; i < this.playerCount; i++) {
                        const newPlayer = {
                            number: this.playerNum,
                            position: {
                                left: '1px',
                                top: '1px'
                            }
                        }
                        this.playersData.push(newPlayer);
                    }
                    this.playerNum = '';
                }
            },
            addResources() {
                if (this.resource.color) {
                    for (let i = 0; i < this.resource.count; i++) {
                        const newResource = {
                            color: this.resource.color,
                            position: {
                                left: 1 + 'px',
                                top: 1 + 'px'
                            }
                        }
                        this.resourcesData.push(newResource);
                    }
                }
            },
            closeModal() {
                this.$emit('update:opened', false)
            }
        }
    }
</script>

<style scoped>

</style>