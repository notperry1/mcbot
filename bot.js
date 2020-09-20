const mineflayer = require('mineflayer')
if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node bot.js <host> <port> [<name>] [<password>]')
    process.exit(1)
}

/* Haha trash talk go brrrr */
const strings = Array(
    "Fuck this server you should join toastmc.dev https://discord.gg/waSAT7Y",
    "Welcome, now leave and play on toastmc.dev https://discord.gg/waSAT7Y",
    "Toastmc.dev on Top https://discord.gg/waSAT7Y",
    "Have you seen this? Have heard about this? https://toastmc.dev/server.html",
    "Did you know that this server is on top? https://discord.gg/waSAT7Y"
);

function create(){
    console.log("Bot is booting...")
    const bot = mineflayer.createBot({
        host: process.argv[2],
        port: parseInt(process.argv[3]),
        username: process.argv[4] ? process.argv[4] : 'ToastmcB0T',
        password: process.argv[5]
    })

    bot.on('login', () => {
        console.log("[Bot] I have logged in successfully!")
        const mcData = require('minecraft-data')(bot.version) // You know the version when the bot has spawned
        const totemId = mcData.itemsByName.totem_of_undying.id // Get the correct id
        if (mcData.itemsByName.totem_of_undying) {
            setInterval(() => {
                const totem = bot.inventory.findInventoryItem(totemId, null, false);
                if (totem) {
                    bot.equip(totem, 'off-hand')
                }
            }, 50)
        }
    })
    bot.on('message', (message) => {
        console.log("[Chat] " + message.toString())
    })
    bot.on('whisper', (username, message, rawMessage) => {
        console.log(`[Bot] I received a message from ${username}: ${message}`)
        bot.whisper(username, 'No u')
    })
    bot.on('playerJoined', (player) => {
        if (player.username !== bot.username) {
            const str = strings[Math.floor(Math.random() * strings.length)];
            bot.whisper(player.username, str)
            console.log(`[Bot] I sent ${player.username} a message: ${str}`)
        }
    })
    bot.on('kicked', (reason, loggedIn) => console.log("[Bot] " + reason, loggedIn))
    bot.on('error', (err) => console.log(err))
    bot.on('end', create)
}
create()