require('dotenv').config(); // Загружает данные из .env
const { Telegraf, Markup } = require('telegraf');

// Теперь токен берется из переменной окружения
const bot = new Telegraf(process.env.BOT_TOKEN);

if (!process.env.BOT_TOKEN) {
    console.error("ОШИБКА: Токен не найден! Создайте файл .env");
    process.exit(1);
}

// --- ГЛАВНОЕ МЕНЮ ---
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
    ctx.reply('Добро пожаловать в груминг салон! Выберите породу:', mainMenu);
});

// --- ЛОГИКА ШПИЦА ---
bot.action('breed_spitz', (ctx) => {
    ctx.editMessageText('Выберите тип шпица:', Markup.inlineKeyboard([
        [Markup.button.callback('Мини или Померанский', 'spitz_type_mini')],
        [Markup.button.callback('Немецкий', 'spitz_type_german')],
        [Markup.button.callback('Японский', 'spitz_type_japan')]
    ]));
});

bot.action(/^spitz_type_/, (ctx) => {
    const type = ctx.match.input.split('_')[2];
    ctx.editMessageText('Выберите стрижку:', Markup.inlineKeyboard([
        [Markup.button.callback('Укороченная стрижка', `final_Шпиц_${type}_Укороченная`)],
        [Markup.button.callback('Породная стрижка (не коротко)', `final_Шпиц_${type}_Породная`)]
    ]));
});

// --- ЛОГИКА ЙОРКА ---
bot.action('breed_york', (ctx) => {
    ctx.editMessageText('Вес, размер:', Markup.inlineKeyboard([
        [Markup.button.callback('До 3,5 кг', 'york_weight_light')],
        [Markup.button.callback('Крупный от 3,5 кг', 'york_weight_heavy')]
    ]));
});

bot.action(/^york_weight_/, (ctx) => {
    const weight = ctx.match.input.includes('light') ? 'до 3.5кг' : 'от 3.5кг';
    // Здесь можно отправить фото: ctx.replyWithPhoto({ source: './images/paws.jpg' })
    ctx.editMessageText('Оформление украшения лап:', Markup.inlineKeyboard([
        [Markup.button.callback('По породе', `final_Йорк_${weight}_По_породе`)],
        [Markup.button.callback('Укороченное', `final_Йорк_${weight}_Укороченное`)],
        [Markup.button.callback('Столбики (на определенный волос)', `final_Йорк_${weight}_Столбики`)],
        [Markup.button.callback('Брить', `final_Йорк_${weight}_Брить`)]
    ]));
});

// --- ЛОГИКА ПУДЕЛЯ ---
bot.action('breed_poodle', (ctx) => {
    ctx.editMessageText('Размер пуделя:', Markup.inlineKeyboard([
        [Markup.button.callback('Той (до 27см)', 'final_Пудель_Той')],
        [Markup.button.callback('Карликовый (до 35см)', 'final_Пудель_Карликовый')],
        [Markup.button.callback('Крупный', 'final_Пудель_Крупный')]
    ]));
});

// --- МАЛЬТИПУ ---
bot.action('breed_maltipoo', (ctx) => {
    ctx.editMessageText('Вид:', Markup.inlineKeyboard([
        [Markup.button.callback('Как мальтезе', 'final_Мальтипу_Тип_Мальтезе')],
        [Markup.button.callback('Как пудель', 'final_Мальтипу_Тип_Пудель')]
    ]));
});

// --- ОСТАЛЬНЫЕ (ПРОСТЫЕ) ---
bot.action(['breed_bichon', 'breed_shitzu'], (ctx) => {
    const breed = ctx.match[0] === 'breed_bichon' ? 'Бишон' : 'Ши-тцу';
    ctx.editMessageText(`Вес для ${breed}:`, Markup.inlineKeyboard([
        [Markup.button.callback('До 3,5 кг', `final_${breed}_до_3.5кг`)],
        [Markup.button.callback('От 3,5 кг', `final_${breed}_от_3.5кг`)]
    ]));
});

bot.action('breed_maltese', (ctx) => {
    ctx.editMessageText('Вы выбрали: Мальтезе');
});

// --- ФИНАЛЬНЫЙ ОБРАБОТЧИК ---
bot.action(/^final_/, (ctx) => {
    const result = ctx.match.input.replace('final_', '').split('_').join(' → ');
    ctx.editMessageText(`✅ Вы выбрали: ${result}`);
});

bot.launch();
