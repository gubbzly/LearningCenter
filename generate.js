const fs = require('fs');
const path = require('path');

const gamesDir = './games';

const files = fs.readdirSync(gamesDir);

const games = files
    .filter(f => f.endsWith('.html'))
    .map(f => ({
        name: path.parse(f).name,
        file: `games/${f}`
    }));

fs.writeFileSync('games.json', JSON.stringify(games, null, 2));
