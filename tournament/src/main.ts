//import './css/styles.css';
import { v4 as uuidv4 } from 'uuid';
// import { SqlDatabase } from 'brackets-prisma-db';
// import { prisma } from './client';
// import { BracketsManager } from 'brackets-manager';

// const { JsonDatabase } = require('brackets-json-db');
// const { BracketsManager } = require('brackets-manager');
// const storage = new SqlDatabase(prisma);
// const manager = new BracketsManager(storage);

type Player = { id: string; name: string };
type Match = {
    id: string;
    player1: Player;
    player2: Player;
    status: 'pending' | 'completed';
};

const app = document.getElementById('app')!;
const players: Player[] = [];
const matches: Match[] = [];
let tournamentStarted = false;

function render() {
    app.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'PONG TOURNAMENT';
    title.className = 'text-4xl text-red-500 font-bold mb-6';
    app.appendChild(title);

    if (!tournamentStarted) {
        const container = document.createElement('div');
        container.className = 'space-y-4 max-w-md mx-auto';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter player name';
        input.className = 'w-full p-2 bg-gray-800 border border-red-500 rounded';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Player';
        addButton.className = 'bg-red-500 text-black font-bold px-4 py-2 rounded hover:bg-red-600 w-full';
        addButton.onclick = () => {
            const name = input.value.trim();
            if (!name) return;
            players.push({ id: uuidv4(), name });
            input.value = '';
            render();
        };

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Tournament';
        startButton.className = 'bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 w-full';
        startButton.disabled = players.length < 4;
        if (startButton.disabled) startButton.classList.add('opacity-30');
        startButton.onclick = () => {
            const shuffled = [...players].sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffled.length; i += 2) {
                if (shuffled[i + 1]) {
                    matches.push({
                        id: uuidv4(),
                        player1: shuffled[i],
                        player2: shuffled[i + 1],
                        status: 'pending'
                    });
                }
            }
            tournamentStarted = true;
            render();
        };

        const list = document.createElement('ul');
        list.className = 'mt-4 text-sm text-gray-300';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `• ${player.name}`;
            list.appendChild(li);
        });

        container.append(input, addButton, startButton, list);
        app.appendChild(container);
    } else {
        const header = document.createElement('h2');
        header.textContent = 'Matches';
        header.className = 'text-2xl font-bold mb-4';
        app.appendChild(header);

        matches.forEach(match => {
            const box = document.createElement('div');
            box.className = 'p-4 border border-gray-700 rounded-lg flex justify-between items-center bg-gray-900 mb-2';

            const info = document.createElement('span');
            info.textContent = `${match.player1.name} vs ${match.player2.name}`;

            const playBtn = document.createElement('button');
            playBtn.textContent = 'Play Match';
            playBtn.className = 'bg-red-500 text-black px-4 py-1 rounded hover:bg-red-600';
            playBtn.className = 'bg-red-500 text-black px-4 py-1 rounded hover:bg-red-600';
            playBtn.onclick = () => {
                const url = `/game/index.html?matchId=${match.id}&p1=${match.player1.name}&p2=${match.player2.name}`;
                window.location.href = url;
            };

            box.append(info, playBtn);
            app.appendChild(box);
        });
    }
}

render();
