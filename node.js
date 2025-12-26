const WEBAPP_URL = https://github.com/I666tima/Grooming_pushistiki.github.io/blob/m;

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
