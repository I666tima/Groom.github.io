require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// --- НАСТРОЙКА ЭКСПРЕСС-СЕРВЕРА (для Render) ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Бот груминг-салона работает! 🐶'));
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

// --- ЛОГИКА БОТА ---
const bot = new Telegraf(process.env.BOT_TOKEN);

const mainMenu = Markup.inlineKeyboard([
    [Markup.button.callback('Шпиц', 'breed_spitz')],
    [Markup.button.callback('Йорк', 'breed_york')],
    [Markup.button.callback('Пудель', 'breed_poodle')],
    [Markup.button.callback('Мальтезе', 'breed_maltese')],
    [Markup.button.callback('Мальтипу', 'breed_maltipoo')],
    [Markup.button.callback('Бишон', 'breed_bichon')],
    [Markup.button.callback('Ши-тцу', 'breed_shitzu')]
]);

bot.start((ctx) => {
    ctx.reply('Добро пожаловать в груминг салон! Выберите породу собаки:', mainMenu);
});

// Шпиц
bot.action('breed_spitz', (ctx) => {
    ctx.editMessageText('Выберите тип шпица:', Markup.inlineKeyboard([
        [Markup.button.callback('Мини или Померанский', 'spitz_mini')],
        [Markup.button.callback('Немецкий', 'spitz_german')],
        [Markup.button.callback('Японский', 'spitz_japan')]
    ]));
});

bot.action(['spitz_mini', 'spitz_german', 'spitz_japan'], (ctx) => {
    const type = ctx.match[0].split('_')[1];
    const typeName = type === 'mini' ? 'Мини' : type === 'german' ? 'Немецкий' : 'Японский';
    ctx.editMessageText(`Шпиц (${typeName}). Выберите стрижку:`, Markup.inlineKeyboard([
        [Markup.button.callback('Укороченная стрижка', `final_Шпиц_${typeName}_Укороченная`)],
        [Markup.button.callback('Породная стрижка', `final_Шпиц_${typeName}_Породная`)]
    ]));
});

// Йорк
bot.action('breed_york', (ctx) => {
    ctx.editMessageText('Вес, размер:', Markup.inlineKeyboard([
        [Markup.button.callback('До 3,5 кг', 'york_w_light')],
        [Markup.button.callback('Крупный от 3,5 кг', 'york_w_heavy')]
    ]));
});

bot.action(['york_w_light', 'york_w_heavy'], (ctx) => {
    const weight = ctx.match[0].includes('light') ? 'до 3.5кг' : 'от 3.5кг';
    ctx.editMessageText('Оформление украшения лап:', Markup.inlineKeyboard([
        [Markup.button.callback('По породе', `final_Йорк_${weight}_По_породе`)],
        [Markup.button.callback('Укороченное', `final_Йорк_${weight}_Укороченное`)],
        [Markup.button.callback('Столбики', `final_Йорк_${weight}_Столбики`)],
        [Markup.button.callback('Брить', `final_Йорк_${weight}_Брить`)]
    ]));
});

// Пудель
bot.action('breed_poodle', (ctx) => {
    ctx.editMessageText('Размер пуделя (пример на фото выше):', Markup.inlineKeyboard([
        [Markup.button.callback('Той (до 27см)', 'final_Пудель_Той')],
        [Markup.button.callback('Карликовый (до 35см)', 'final_Пудель_Карликовый')],
        [Markup.button.callback('Крупный', 'final_Пудель_Крупный')]
    ]));
});

// Мальтезе
bot.action('breed_maltese', (ctx) => {
    ctx.editMessageText('✅ Вы выбрали: Мальтезе');
});

// Мальтипу
bot.action('breed_maltipoo', (ctx) => {
    ctx.editMessageText('Вид:', Markup.inlineKeyboard([
        [Markup.button.callback('Как мальтезе', 'final_Мальтипу_Тип_Мальтезе')],
        [Markup.button.callback('Как пудель', 'final_Мальтипу_Тип_Пудель')]
    ]));
});

// Бишон и Ши-тцу
bot.action(['breed_bichon', 'breed_shitzu'], (ctx) => {
    const breed = ctx.match[0] === 'breed_bichon' ? 'Бишон' : 'Ши-тцу';
    ctx.editMessageText(`${breed}. Вес, размер:`, Markup.inlineKeyboard([
        [Markup.button.callback('До 3,5 кг', `final_${breed}_до_3.5кг`)],
        [Markup.button.callback('От 3,5 кг', `final_${breed}_от_3.5кг`)]
    ]));
});

// Финальный вывод
bot.action(/^final_/, (ctx) => {
    const path = ctx.match.input.replace('final_', '').split('_').join(' → ');
    ctx.editMessageText(`✅ Вы выбрали:\n${path}`);
});

bot.launch();

// Остановка бота при выключении сервера
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
