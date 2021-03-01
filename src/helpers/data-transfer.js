import axios from "axios";
export function sendData(gameId, players,resources) {
    const game_id = gameId;
    let content = {
        players,
        resources
    }
    content = JSON.stringify(content)
    content = content.replace(/\s+/g, '');
    var fd = new FormData();
    fd.append('game_id', game_id);
    fd.append('content', content);

    axios
        .post(
            '/update.php', fd, {
                transformRequest: (req) => {
                    return req;
                },
            }
        )
        .then(response => {
            console.log(response)
        });
}
