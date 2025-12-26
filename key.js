// Подключаем dotenv и указываем путь к файлу .env
require('dotenv').config({ path: /storage/emulated/0/Download/Меню Telegram/.env });

const { Telegraf } = require('telegraf');

// Берём токен и URL из переменных окружения
const BOT_API_TOKEN = process.env.BOT_API_TOKEN;
const WEBAPP_URL = https://github.com/I666tima/Grooming_pushistiki.github.io/blob/m;

// Проверка: если токен не найден
if (!BOT_API_TOKEN) {
  throw new Error('Токен бота не найден в меню/.env!');
}

const bot = new Telegraf(BOT_API_TOKEN);

bot.start((ctx) => {
  return ctx.reply('Выбрать стрижку', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Выбрать стрижку',
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    }
  });
});

bot.launch();
