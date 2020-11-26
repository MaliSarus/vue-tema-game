<template>
    <main>
        <div class="game-wrapper">
            <img :src="map" alt="" class="game-image">
            <div class="game-field" ref="field">
                <div
                        ref="player"
                        v-for="(player, index) in playersData"
                        class="player"
                        :key="'player_' + index"
                        :data-index="index"
                        :style="{
                            left: player.position.left,
                            top: player.position.top
                        }"
                >
                    {{player.number}}
                </div>
                <div
                        v-for="(resource, index) in resourcesData"
                        class="resource"
                        :key="'resource_' + index"
                        :data-index="index"
                        :style="{
                            backgroundColor: resource.color,
                            left: resource.position.left,
                            top: resource.position.top
                        }"
                        ref="resource"
                />
            </div>
        </div>
        <!--        <div class="admin">-->
        <!--            <button class="admin-login">Я ведущий</button>-->
        <!--            <form action="">-->
        <!--                <input type="password" class="admin-password" placeholder="введите пароль">-->
        <!--            </form>-->
        <!--            <div class="wrong-pass">Неправильный пароль, попробуйте еще раз</div>-->
        <!--        </div>-->

        <div class="game-controls active">
            <button class="call-modal" @click="openModal">Добавить</button>
            <button class="clear">Очистить</button>
            <button class="logout">Выйти из режима ведущего</button>
        </div>
    </main>
</template>

<script>
    import $ from 'jquery'
    import jQueryBridget from 'jquery-bridget';
    import Draggabilly from 'draggabilly'

    export default {
        name: "Game",
        props: ['map', 'players', 'resources', 'opened'],
        data() {
            return {
                loading: false,
                activeIndex: '',
                draggablePlayers: [],
                draggableResources: [],
                lastPlayerIndex: this.players.length - 1,
                lastResourcesIndex: this.resources.length - 1
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
            }
        },
        methods: {
            setDragItems(playersIndex, resourcesIndex) {
                const draggablePlayers = document.querySelectorAll('.game-field .player');
                const draggableResources = document.querySelectorAll('.game-field .resource');
                const vue = this;
                this.fillDraggableArray(draggablePlayers, this.draggablePlayers, playersIndex, this, 'player');
                this.fillDraggableArray(draggableResources, this.draggableResources, resourcesIndex, this, 'resource');
            },
            fillDraggableArray(draggableElements, draggableArray, startIndex, vue, memo) {
                for (let i = startIndex; i < draggableElements.length; i++) {
                    const draggableElem = draggableElements[i];
                    const draggie = new Draggabilly(draggableElem, {
                        containment: true
                    }).on('dragEnd', function (event) {
                        const that = $(event.target)
                        console.log(event.target)
                        const index = that.attr('data-index');
                        const position = {
                            left: (that.offset().left - $('.game-field').offset().left) / $('.game-field').width() * 100 + '%',
                            top: (that.offset().top - $('.game-field').offset().top) / $('.game-field').height() * 100 + '%'
                        }
                        switch (memo) {
                            case 'player':
                                vue.setPlayerPos(index, position);
                                break;
                            case 'resource':
                                vue.setResourcePos(index, position);
                                break;
                            default:
                                break;
                        }
                        draggableArray[index].setPosition(position.left, position.top)
                    });
                    draggableArray.push(draggie);
                }
            },
            setResourcePos(index, {left, top}) {
                this.resourcesData[index].position.left = left;
                this.resourcesData[index].position.top = top;
            },
            setPlayerPos(index, {left, top}) {
                this.playersData[index].position.left = left;
                this.playersData[index].position.top = top;
            },
            openModal() {
                this.$emit('update:opened', true)
            }
        },
        mounted() {
            this.setDragItems(0, 0);
            // dragPlayers.;
        },
        updated() {
            console.log('update')
            this.setDragItems(this.lastPlayerIndex + 1, this.lastPlayerIndex + 1);
        }
    }
</script>

<style scoped>

</style>