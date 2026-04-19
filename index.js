const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Your bot token - paste in CodeSnack environment variables
const TOKEN = process.env.DISCORD_TOKEN || 'MTQ5NTQ1ODc5NTIyNzMxNjM1NQ.GRqXv5.LwRg86NemFzm0VwaVV9bpqLbR04FUUIvEjUpiI';

// Script database (you can add more)
const scripts = [
    {
        name: "Auto Farm Script",
        description: "Automatically farms resources in game",
        code: `-- Auto Farm Script
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:wait()

while wait(0.5) do
    -- Farming logic here
    print('Farming...')
end`,
        game: "Various Games",
        type: "Farming"
    },
    {
        name: "Teleport Script",
        description: "Teleports your character to click location",
        code: `-- Teleport Script
local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

mouse.Button1Down:Connect(function()
    local target = mouse.Hit.p
    player.Character.HumanoidRootPart.CFrame = CFrame.new(target)
end)`,
        game: "Universal",
        type: "Movement"
    },
    {
        name: "Speed Script",
        description: "Increases character movement speed",
        code: `-- Speed Script
local player = game.Players.LocalPlayer
local character = player.Character
local humanoid = character.Humanoid

humanoid.WalkSpeed = 50 -- Normal is 16
humanoid.JumpPower = 80 -- Normal is 50`,
        game: "Universal",
        type: "Movement"
    }
];

// Ready event
client.once('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    console.log(`📜 Loaded ${scripts.length} Roblox scripts`);
    client.user.setActivity('!scripts for Roblox codes', { type: 'WATCHING' });
});

// Message handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // !scripts - Show all available scripts
    if (command === 'scripts') {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📜 Available Roblox Scripts')
            .setDescription('Use `!get <number>` to get a script\nExample: `!get 1`')
            .setTimestamp();

        scripts.forEach((script, index) => {
            embed.addFields({
                name: `${index + 1}. ${script.name}`,
                value: `🎮 ${script.game} | 📂 ${script.type}\n${script.description}`,
                inline: false
            });
        });

        await message.channel.send({ embeds: [embed] });
    }

    // !get <number> - Get script by number
    if (command === 'get') {
        const scriptNumber = parseInt(args[0]) - 1;
        
        if (isNaN(scriptNumber) || scriptNumber < 0 || scriptNumber >= scripts.length) {
            return message.reply('❌ Invalid script number! Use `!scripts` to see available scripts.');
        }

        const script = scripts[scriptNumber];
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`📝 ${script.name}`)
            .setDescription(script.description)
            .addFields(
                { name: '🎮 Game', value: script.game, inline: true },
                { name: '📂 Type', value: script.type, inline: true },
                { name: '💻 Script Code', value: `\`\`\`lua\n${script.code}\n\`\`\`` }
            )
            .setFooter({ text: '⚠️ Use at your own risk | May violate Roblox ToS' });

        await message.channel.send({ embeds: [embed] });
    }

    // !search <keyword> - Search scripts
    if (command === 'search') {
        const keyword = args.join(' ').toLowerCase();
        
        if (!keyword) {
            return message.reply('🔍 Please provide a search term! Example: `!search farm`');
        }
        
        const results = scripts.filter(s => 
            s.name.toLowerCase().includes(keyword) || 
            s.description.toLowerCase().includes(keyword) ||
            s.type.toLowerCase().includes(keyword)
        );

        if (results.length === 0) {
            return message.reply(`🔍 No scripts found matching "${keyword}"`);
        }

        const embed = new EmbedBuilder()
            .setColor(0xFF9900)
            .setTitle(`🔍 Search: "${keyword}"`)
            .setDescription(`Found ${results.length} script(s)\nUse \`!get #\` to view them`);

        results.forEach((script, index) => {
            const originalIndex = scripts.findIndex(s => s.name === script.name) + 1;
            embed.addFields({
                name: `${originalIndex}. ${script.name}`,
                value: `📂 ${script.type} - ${script.description.substring(0, 80)}...`,
                inline: false
            });
        });

        await message.channel.send({ embeds: [embed] });
    }

    // !info - Bot info
    if (command === 'info') {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('🤖 Roblox Script Bot')
            .setDescription('A bot to share Roblox scripts')
            .addFields(
                { name: '📜 Commands', value: '`!scripts` - List all scripts\n`!get <number>` - Get a script\n`!search <keyword>` - Search scripts\n`!info` - Bot info', inline: false },
                { name: '📊 Stats', value: `Loaded ${scripts.length} scripts`, inline: true },
                { name: '⚠️ Warning', value: 'Some scripts may violate Roblox Terms of Service', inline: false }
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
});

// Error handling
client.on('error', console.error);

// Login to Discord
client.login(TOKEN);
