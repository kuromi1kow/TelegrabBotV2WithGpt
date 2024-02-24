const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
//Инициализируем переменные из .env
const API_KEY_BOT = '6434531598:AAGjW4a3X9GrG7R7oQiWnZphx9g4GyM4m_s';
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: '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' });
const bot = new TelegramBot(API_KEY_BOT, {

    polling: true
    
});
//Массив с объектами для меню команд

//Массив с объектами для меню команд
const commands = [

    {command: "start", description: "Запуск бота"},
    {command: "help", description: "Раздел помощи"},
    {command: "link", description: "Ссылка"},
    {command: "menu", description: "Меню-клавиатура"},

]

//Устанавливаем меню команд
bot.setMyCommands(commands);

//Слушатель для текстового сообщения
bot.on('text', async msg => {

    try {

        //Обрабатываем запуск бота
        if(msg.text.startsWith('/start')) {
            
            //Приветственное сообщение
            await bot.sendMessage(msg.chat.id, `kuromi1kow for russian final , Вы запустили бота! 👋🏻
`);

            //Проверяем, был ли запущен бот по ссылке из раздела /ref
            if(msg.text.length > 6) {
                //Получаем ID из параметров запуска бота
                const refID = msg.text.slice(7);
                //Если человек зашёл по ref-ссылке, то ему придёт сообщение с информацией об этом
                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);

            }

        }
      
        else if(msg.text == '/help') {

            //Пример HTML-стилизации текста
            await bot.sendMessage(msg.chat.id, `Информация про меня: Я создаю заголовки по вашему тексту. Тем самым я лучший на свете генератор заголовков для СМИ`, {

                parse_mode: "HTML"

            });

           
        }
        else if(msg.text == '/link') {

            await bot.sendMessage(msg.chat.id, `https://github.com/kuromi1kow`, {

                //Выключаем превью ссылки в сообщении
                disable_web_page_preview: true,
                //Отключаем уведомление о сообщении для пользователя
                disable_notification: true

            });

        }
        else if(msg.text == '/menu') {

            await bot.sendMessage(msg.chat.id, `Меню бота`, {

                reply_markup: {
                    //Добавляем пользователю меню-клавиатуру
                    keyboard: [

                        [ '⭐️ Генератор заголовков СМИ'],
                        [{text: '⭐️ Контакт', request_contact: true}, {text: '⭐️ Геолокация', request_location: true}],
                        ['❌ Закрыть меню']

                    ],
                    //Подгоняем размер меню-клавиатуры
                    resize_keyboard: true

                }

            })

        }
      
        else if(msg.text == '⭐️ Картинка') {

            //Скидываем изображение ссылкой
            //await bot.sendPhoto(msg.chat.id, process.env.URL_TO_IMG);

            //Скидываем изображение указав путь
            //await bot.sendPhoto(msg.chat.id, './image.jpg');

            //Скидываем изображение с помощью Readable Stream
            const imageStream = fs.createReadStream('./image');
            await bot.sendPhoto(msg.chat.id, imageStream, {

                caption: '<b>⭐️ Картинка</b>',
                parse_mode: 'HTML'

            });
            const imageBuffer = fs.readFileSync('./image.jpg');
            await bot.sendPhoto(msg.chat.id, imageBuffer);

        }
    
        else if(msg.text == '⭐️ Аудио') {

            //Скидываем аудио
            await bot.sendAudio(msg.chat.id, './audio.mp3', {

                caption: '<b>⭐️ Аудио</b>',
                parse_mode: 'HTML'

            });

        }
        else if(msg.text == '⭐️ Голосовое сообщение') {

            //Скидываем голосовое сообщение
            await bot.sendVoice(msg.chat.id, './audio.mp3', {

                caption: '<b>⭐️ Голосовое сообщение</b>',
                parse_mode: 'HTML'

            });

        }
        else if(msg.text == '⭐️ Контакт') {

            //Скидываем контакт
            await bot.sendContact(msg.chat.id, process.env.CONTACT, `Контакт`, {

                reply_to_message_id: msg.message_id

            });

        }
        else if(msg.text == '⭐️ Геолокация') {

            //Определяем широту и долготу нужной координаты
            const latitudeOfRedSquare = 55.753700;
            const longitudeOfReadSquare = 37.621250;
            //Скидываем геолокацию нужной координаты
            await bot.sendLocation(msg.chat.id, latitudeOfRedSquare, longitudeOfReadSquare, {

                reply_to_message_id: msg.message_id

            })

        }
        else if(msg.text == '❌ Закрыть меню') {

            await bot.sendMessage(msg.chat.id, 'Меню закрыто', {

                reply_markup: {
                    //Выключаем клавиатуру у пользователя
                    remove_keyboard: true

                }

            })

        }
        else {

          try {
    // Проверяем, не от бота ли пришло сообщение
    if (msg.from.id !== bot.me.id) {
        // Отправляем пользователю сообщение
        const msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);

        // Через 5 секунд редактируем сообщение о генерации и вставляем туда сообщение пользователя (эхо-бот)
        setTimeout(async () => {
            await bot.editMessageText(msg.text, {
                chat_id: msgWait.chat.id,
                message_id: msgWait.message_id
            });
        }, 5000);
    }
} catch (error) {
    console.log(error);
}

        }

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем сообщение с картинкой от пользователя
bot.on('photo', async img => {

    try {
        //Массив, в который затащим все варианты картинок
        const photoGroup = [];
        //Перебираем все варианты картинок (сжатые и оригинал) и добавляем информацию о них в массив
        for(let index = 0; index < img.photo.length; index++) {
            //Скачиваем картинку
            const photoPath = await bot.downloadFile(img.photo[index].file_id, './image');
            //Добавляем информацию о картинке в массив используя путь до картинки и информацию о вариантах из img
            photoGroup.push({

                type: 'photo',
                media: photoPath,
                caption: `Размер файла: ${img.photo[index].file_size} байт\nШирина: ${img.photo[index].width}\nВысота: ${img.photo[index].height}`

            })

        }
        //Отправляем пользователю все варианты картинок
        await bot.sendMediaGroup(img.chat.id, photoGroup);
        //Перебираем и удаляем все картинки, которые скачали
        for(let index = 0; index < photoGroup.length; index++) {

            fs.unlink(photoGroup[index].media, error => {

                if(error) {

                    console.log(error);

                }

            })

        }

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем сообщение с видео от пользователя
bot.on("video", async video => {

    try {
        //Скачиваем миниатюру видео
        const thumbPath = await bot.downloadFile(video.video.thumbnail.file_id, './image');
        //Скидываем пользователю видео с информацией о нём и миниатюру
        await bot.sendMediaGroup(video.chat.id, [
            
            {

                type: 'video',
                media: video.video.file_id,
                caption: `Название файла: ${video.video.file_name}\nВес файла: ${video.video.file_size} байт\nДлительность видео: ${video.video.duration} секунд\nШирина кадра в видео: ${video.video.width}\nВысота кадра в видео: ${video.video.height}`

            },
            {

                type: 'photo',
                media: thumbPath,

            }

        ]);
        //Удаляем миниатюру
        fs.unlink(thumbPath, error => {

            if(error) {

                console.log(error);

            }

        })

    }
    catch(error) {

        console.log(error);

    }

})

bot.on('text', async (msg) => {
    try {
        // ... (ваш код для обработки различных команд)

        // Обработка команды для модели OpenAI GPT-3.5 Turbo
        if (msg.text == '⭐️ Генератор заголовков СМИ') {
            // Отправляем запрос для получения пользовательского текста
            await bot.sendMessage(msg.chat.id, 'Введите текст для генерации заголовка:');

            // Ожидаем ответ от пользователя
            bot.once('text', async (userInput) => {
                // Генерация ответа с использованием OpenAI
                const response = await sendMessage(userInput.text);

                // Отправка сгенерированного ответа в чат Telegram
                await bot.sendMessage(msg.chat.id, response);
            });
        }

    } catch (error) {
        console.error(error);
    }
});

// Функция для отправки сообщения в OpenAI для генерации ответа
const sendMessage = async (text) => {
    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4-0125-preview',
            messages: [{ role: 'user', content: text }],
            stream: true
        });

        let answer = '';
        for await (const chunk of stream) {
            answer += chunk.choices[0]?.delta?.content || '';
        }

        return answer.trim(); // Убрать начальные и конечные пробелы
    } catch (error) {
        console.error(error);
        return 'Ошибка генерации ответа.';
    }
};

//Обрабатываем сообщение с аудио от пользователя
bot.on('audio', async audio => {

    try {   
        //Скидываем пользователю аудио и информацию об аудио
        await bot.sendAudio(audio.chat.id, audio.audio.file_id, {

            caption: `Название файла: ${audio.audio.file_name}\nВес файла: ${audio.audio.file_size} байт\nДлительность аудио: ${audio.audio.duration} секунд`

        })

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем голосовое сообщение от ползователя
bot.on('voice', async voice => {

    try {
        //Скидываем пользователю его голосовое сообщение аудио-файлом и пишем информацию о нем
        await bot.sendAudio(voice.chat.id, voice.voice.file_id, {

            caption: `Вес файла: ${voice.voice.file_size} байт\nДлительность аудио: ${voice.voice.duration} секунд`

        })

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем сообщение с контактом от пользователя
bot.on('contact', async contact => {

    try {
        //Скидываем пользователю информацию о контакте
        await bot.sendMessage(contact.chat.id, `Номер контакта: ${contact.contact.phone_number}\nИмя контакта: ${contact.contact.first_name}`);

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем сообщение с геолокацией от пользователя
bot.on('location', async location => {

    try {
        //Отправляем пользователю широту и долготу геолокации, которую он нам отправил
        await bot.sendMessage(location.chat.id, `Широта: ${location.location.latitude}\nДолгота: ${location.location.longitude}`);

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем сообщение со стикером от пользователя
bot.on('sticker', async sticker => {

    try {

        //Скачиваем файл стикера
        const stickerPath = await bot.downloadFile(sticker.sticker.file_id, './image');
        //В зависимости от типа стикера скидываем пользователю файл с ним (видео, анимация или картинка)
        if(sticker.sticker.is_video) {

            await bot.sendVideo(sticker.chat.id, stickerPath);

        }
        else if(sticker.sticker.is_animated) {

            await bot.sendAnimation(sticker.chat.id, sticker.sticker.file_id);

        }
        else {

            await bot.sendPhoto(sticker.chat.id, stickerPath);

        }
        //Удаляем файл стикера
        fs.unlink(stickerPath, error => {

            if(error) {

                console.log(error);

            }

        })

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем коллбеки на инлайн-клавиатуре
bot.on('callback_query', async ctx => {

    try {

        switch(ctx.data) {
            //Кнопка закрытия меню удаляет сообщение с меню и сообщение, по которому было вызвано меню
            case "closeMenu":

                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                await bot.deleteMessage(ctx.message.reply_to_message.chat.id, ctx.message.reply_to_message.message_id);
                break;
            //Кнопкой стикера скидываем пользователю картинку стикером
            case "sticker":

                await bot.sendSticker(ctx.message.chat.id, `./image.jpg`);
                break;
            //Отправляем пользователю круглое видео
            case "circleVideo":

                await bot.sendVideoNote(ctx.message.chat.id, './video.mp4', {

                    protect_content: true

                });
                break;
            //Проверяем подписку пользователя на канал и отвечаем ему сообщением в зависимости от того, является ли он подписчиком канала
            case "checkSubs":

                const subscribe = await bot.getChatMember(process.env.ID_CHAT, ctx.from.id);

                if(subscribe.status == 'left' || subscribe.status == 'kicked') {

                    await bot.sendMessage(ctx.message.chat.id, `<b>Вы не являетесь подписчиком!</b>`, {

                        parse_mode: 'HTML'

                    })

                }
                else {

                    await bot.sendMessage(ctx.message.chat.id, '<b>Вы являетесь подписчиком!</b>', {

                        parse_mode: 'HTML'

                    })

                }

                break;
            //Отправляем пользователю счет на оплату
            case "buyFile":

                await bot.sendInvoice(ctx.message.chat.id, 
                                    'Купить Файл', //Заголовок счета
                                    'Покупка файла', //Описание счета
                                    'file', //Payload - используем для того, чтобы отследить платеж, пользователю не отображается
                                    process.env.PROVIDER_TOKEN, //Провайдер-токен от платежки
                                    'RUB', //Код валюты
                                    [{

                                        label: 'Файл', //Название товара
                                        amount: 20000 //Цена товара (в копейках!!!)
                                    
                                    }]);

                break;

        }

    }
    catch(error) {

        console.log(error);

    }

})

//Окончательно подтверждаем формирование заказа по счету при оплате
bot.on('pre_checkout_query', async ctx => {

    try {

        await bot.answerPreCheckoutQuery(ctx.id, true);

    }
    catch(error) {

        console.log(error);

    }

})

//Обрабатываем удачный платеж от пользователя
bot.on('successful_payment', async ctx => {

    try {
        //Отправляем пользователю документ и выводим информацию в зависимости от payload из платежа
        await bot.sendDocument(ctx.chat.id, `./${ctx.successful_payment.invoice_payload}.txt`, {

            caption: `Спасибо за оплату ${ctx.successful_payment.invoice_payload}!`

        })

    }
    catch(error) {

        console.log(error);

    }

})

//Ловим ошибки polling'a
bot.on("polling_error", err => console.log(err.data.error.message));