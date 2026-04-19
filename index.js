const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Change this:
const TOKEN = process.env.DISCORD_TOKEN;

// To this (put YOUR actual token):
const TOKEN = 'MTQ5NTQ1ODc5NTIyNzMxNjM1NQ.GHIBWe.K1kSN-3JS6rmuv2-w_F1YFpOAGCNfF3hHS2DM8';

// Your Roblox scripts database
const scripts = [
    {
        name: "Auto Farm Script",
        description: "Automatically farms resources",
        code: `-- Auto Farm Script
local player = game.Players.LocalPlayer
while wait(0.5) do
    print('Farming...')
end`,
        game: "Various Games",
        type: "Farming"
    },
    {
        name: "Teleport Script",
        description: "Teleports to click location",
        code: `-- Teleport Script
local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

mouse.Button1Down:Connect(function()
    local target = mouse.Hit.p
    player.Character.HumanoidRootPart.CFrame = CFrame.new(target)
end)`,
        game: "Universal",
        type: "Movement"
    }
];

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📜 Loaded ${scripts.length} scripts`);
    client.user.setActivity('!scripts', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'scripts') {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📜 Roblox Scripts')
            .setDescription('Use `!get 1` to get a script');

        scripts.forEach((script, index) => {
            embed.addFields({
                name: `${index + 1}. ${script.name}`,
                value: `${script.description}\n🎮 ${script.game}`,
                inline: false
            });
        });

        await message.channel.send({ embeds: [embed] });
    }

    if (command === 'get') {
        const num = parseInt(args[0]) - 1;
        if (!scripts[num]) return message.reply('❌ Invalid number!');

        const script = scripts[num];
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`📝 ${script.name}`)
            .setDescription(script.code)
            .addFields(
                { name: 'Game', value: script.game, inline: true },
                { name: 'Type', value: script.type, inline: true }
            );

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(TOKEN);
