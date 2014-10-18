
# What is Node.JS? Why Node.JS?

## What is Node.JS? 

- V8
  - Fast, memory-effective JS VMachine (there are other, V8 one of the best)
- LibUV, JS by itself cannot do IO, but LibUV can
- JS and C code to bind that together and add more modules


## Why Node.JS?

- If you already use & love JS
- Common code on client and the server (live preview)
- Can solve common web tasks, especially many connections in the same time
- Fast to make a working prototype
- active community

Not a silver bullet for everything though.
Sometimes difficult to debug, not enough low-level bindings, not for everything, for web fine.

# Up and running 

- open nodejs.org, show where to click
- downloading and installing  /Windows 10, because most questions come from Win/
- node $PATH (maybe restart console to use node)
- node CLI (rarely needed, but...)
- node hello.js

# Building a custom node [optional]

- Why custom?
  - Enable node internal debugging (if something really weird inside node)
  - enable ES6 flags
    - current node needs --harmony for generators, many CLI utils (we'll see later) rely on default node flags, and we want harmony to be default
- Building
  - Git
  - Mac/Linux: nvm install -s 0.11 --v8-options="--harmony"
  - Windows:
    - Install python
    - Install Visual Studio (Desktop Express is ok)
    - For MSI
      - Install WIX (3.9 is ok) https://wix.codeplex.com/releases/view/115492
      - Install .NET 3.5
    - python configure --dest-cpu=x64 --v8-options=--harmony
    - .\vcbuild.bat release nosign x64 noprojgen msi
                    ^ not debug build
                            ^ no binary signing (we don't release this outside)
                                   ^ not ia32
                                       ^ cdon't run configure
                                                 ^ make msi installer for easy install
    - test: "console.log(function*() {})" | set-content 1.js


# Fine-tuning Webstorm IDE

- I will use webstorm, if you go after me, useful to know this...
- Settings -> Node.JS, download sources, set scope
- JSHint
  - example: undefined variable (typo)
- Language level ES6
- CLI plugin (for cmd+x)

# CommonJS Modules @modules

- log, require.cache for parent module

# streams

- pipe events
src.pipe(dst)

src.end     -> dst.end  ->  cleanup 

dest.unpipe ->              cleanup

dest.drain  -> (write)
dest.data   -> (write)

dest.error  -> unpipe   ->  cleanup   
dest.close  -> unpipe   ->  cleanup
dest.finish -> unpipe   ->  cleanup

- Errors
  - @bad_encoding, never do chunk.toString('utf-8'), cuts multibyte chars
  - @gunzip_bad, error on any pipe
  - @data_no_readable, data(or pipe which uses it inside) cancels readable (except the last)
  - writable stream is closed (e.g connection down, need to close src too)





# Web-Server

- Built-in module: require('http')
- http.createServer() -> listen 
  increase backlog for HL, example: node.js has a constant rate of requests and serves them fast, then suddenly a hiccup and if the queue is 511, some clients get "conn refused", otherwise they queue up and get served eventually. Tune OS-level TCP too.
- serving requests: events, if (req.url == '/hello') res.end("hello world")
- methods of req/res in http docs (http docs have both server and agent, see IncomingMessage for req!!!)

- no "on" method in server docs, where does it come from?
  - what is server? go __proto__ chain, see http://ilyakantor.ru/screen/2014-10-05_1211.png
    - http.Server > net.Server > events.EventListener (in node console)

# EventEmitter 
- 
    - on('request', function(req, res) { /* read from req write to res */ })
    - which events?
      - replace emit with a wrapper

# Modules @server

- require != <script> (no global vars)

# Debug

node-debug (debug-brk + open in default browser (should be chrome))

# Deploy

pm2 switches on listening

## Введение в Node.JS // @intro

- Введение
  - О чём этот скринкаст?
    - Этот скринкаст посвящён тому, как создавать веб-приложения, сайты и сервисы под Node.JS
    - Мы не будем обсуждать все функции и методы, так как многие из них нужны очень редко
    - Но мы в деталях, от а до я пройдём всё самое важное.
  - Окружение для разработки и примеров
    - Sublime Webstorm Mac/Win, плагины
- Что такое Node.JS?
  - V8 от Google (JS) + вспомогательные библиотеки + JS/C от Node.JS
  - V8 очень быстрая и бережливая к памяти, этим он лучше Rhino и некоторых других движков
  - V8 полностью поддерживает современный ES5, и ряд возможностей нового стандарта, которые можно включить флагом harmony
  - Node, используя дополнительные библиотеки и С/JS добавляет объекты, которые поддерживают работу с сетью и т.п.
  - Node.JS от Ryan Dahl, Joyent - обёртка над V8, которая добавляет в JS много всего
- Установка и запуск
  - http://nodejs.org

    - Куда ставится Node.JS?
    - Пути
  - Выполнение скриптов
    - Консоль REPL
    - Скрипты .js
    - console.*  // @server
  - Документация
    - Пример console
    - Стабильность интерфейса != надёжность
    - Чтение кода встроенных модулей из исходников
- Почему Node.JS?
  - Хочу JavaScript!
  - Общие библиотеки на клиенте и сервере
    - Не ставит своей целью использовать один код и там и там
  - Решает основные задачи для Web
    - База данных?
    - Низкоуровневый доступ к сети?
    - TCP/UDP? Легко!
    - В то же время, это инструмент не для всего. Это не самый быстрый способ вычислить число Пи...
  - Много соединений и задач одновременно.
  - V8 &mdash; это быстрый код и малые затраты памяти
    - Если прямые руки, JS очень динамический
  - Легко сделать рабочий прототип.
  - Удобный менеджер пакетов, где много-много всего.

## Модули // @module

- Модули Node.JS, отличия от <script>
  - Подключение, экспорт переменных // @hello
  - Отличия require('module') от <script>
  - this в функции одна, снаружи другая, поэтому лучше везде использовать exports

- Глобальные переменные приложения и модуля
  - global: все переменные var туда не входят, но есть такой глобальный объект аналог window
    - вывести, посмотреть
// http://www.hacksparrow.com/global-variables-in-node-js.html

 // - process: процесс, окружение env, записывать в неё нехорошо
- Виды модулей: .JS, .JSON, .NODE, DIR/index // @2 @3
- Объект модуля // @module-object
  - module.exports = exports
  - module.parent для определения - вызван ли модуль из node или просто require: if (!module.parent)
  - module.filename используется иногда для логирования
  - module.children - что подключил
  - module.paths - по каким относительным путям будет искать require внутри него (внутреннее, в доках нет)
- Где Node.JS ищет модуль?
  - встроенный модуль
  - примеры встроенных модулей, документация
  - node_modules в текущей директории и выше // @4
  - NODE_PATH
  - дополнительные каталоги, полный порядок поиска node-v0.10.4/doc/api/modules.html
- Кеширование модулей
  - объект модуля кэшируется для файла (ключ - кэша имя файла, надо чтобы доступ по 1му пути) // @5
  - на самом деле это очень удобно, модуль подключается в разных местах, хранит состояние в локальных переменных // @6
- Модуль-функция
  - Задача: сделать модуль для генерации случайных чисел от a до b // @7
  - Конструктор тоже экспортируют // @user
- Модуль-фабрика
    - Передача объектов в модули // @factory

## Пакетный менеджер NPM // @npm

Всем привет!
Это занятие посвящено NPM (Node Packet Manager) - менеджеру пакетов для Node.JS.

Вначале, когда Node.JS только появился, никакого NPM не было. Но Node.JS стремительно развивался.
Появлялись люди, которые писали свои модули для решения частых задач и хотели делиться ими с другими людьми. Ответом на их запросы стал NPM.

NPM -- это консольная утилита, которая ставится вместе с Node.JS и умеет работать с "репозитарием" -- базой данных, которая находится по адресу http://registry.npmjs.org и содержит информацию о тысячах полезных модулей.

Мы можем легко увидеть её содержимое, зайдя на соответствующий адрес в браузере. Это потому, что база основана на системе CouchDB, которая работает по протоколу HTTP.

Как и Node.JS, эта база является проектом с открытым исходным кодом, поэтому нет никакой проблемы взять и поднять такую же на любом сервере, а после этого настроить NPM, чтобы она работала с новым адресом. Так поступают многие организации, которые хотят публиковать модули в хранилище на уровне компании, для внутреннего пользования, не для всех. Если это вам понадобится - погуглите "private npm repository".

Далее нашей задачей будет изучить основной поток работы с NPM.

С чего начинается NPM? Конечно же, с программиста Василия, который сделал отличный модуль и хотел бы поделиться им с сообществом.

Например, такой.

Для того, чтобы это сделать, ему нужно создать специальный файл package.json, который описывает пакет. Это можно сделать вручную, но удобнее - с помощью специальной команды npm init.

Она запросит основную информацию о пакете: имя модуля, версию и всякие другие необязательные, которые я пока оставлю по умолчанию, и создаст по ним package.json.

Самые важные поля - это имя и версия, остальные я пока удалю. Для публикации в центральном репозитарии имя должно быть уникальным, чужой модуль с тем же именем перезаписать нельзя.

Всё, теперь модуль можно публиковать в репозитарии. Для этого используется команда npm publish.
Но если её просто запустить, то она подумает-подумает и выдаст ошибку, потому что нужен пользователь.

Пользователь создаётся командой npm adduser, которая

При помощи NPM любой может зарегистрировать пользователя в репозитарии и добавить туда свой модуль.

// http://clock.co.uk/tech-blogs/how-to-create-a-private-npmjs-repository

- Что такое NPM? // короткие команды! npm i; npm r; npm s;
  - В ядре модулей мало, гораздо больше можно поставить
  - Мощное управление зависимостями, можно использовать разные версии одного модуля одновременно (из разных мест)
- Основные команды: `npm s i r`
  - `npm install debug`
- Как выглядит NPM-пакет? `package.json`  // все фигня кроме scripts
  - npm.init && npm test // @init , изменил test чтобы работало, добавил README  чтобы без warn
  - package.json, описание полей // must be valid JSON, not just JS object!
  - npm start  // @start, добавил server.js - его по умолчанию запускает
- Управление зависимостями
  - в package.json можно прописать и зависимости // @3
  - можно указать * или версию ~0.10  >=0.1 и т.п. http://semver.org

  - npm install автоматически поставит их в поддиректорию node_modules
  - либо если через npm publish пакет добавить, то другие люди, которые будут ставить модуль, сразу установят с зависимостями его
- Локальные и глобальные модули
  - Локальные модули: в ближайший node_modules / package.json
  - Демо: устанавливаем uglify-js, бинарник лежит в .bin
  - Глобальные модули: нельзя require, ставят для запуска из консоли - бинарники идут в PATH для NPM
  - Демо: глобальный uglify-js, запускаем его
  - Установка нужной версии: npm install uglify-js@<version/tag> или npm install каталог/tgz/URL с tgz/CgjgkfnОтветом на них явился NPM: пакетный мешGДrjhh
  - Чтобы сэкономить место на диске, можно npm link, но лучше не надо
- Другие команды npm
  - prune (удалить лишние)
  - update (обновить зависимости)
- Резюме
  - В дальнейшем мы по ходу скринкаста будем ставить многие полезные модули..
  - npm install debug / winston

## Самые часто используемые модули // @top

@task вывести только названия свойств, которые есть в объекте
@task вывести только свойства первого уровня (большой объект), используя util.inspects

- util // @util
  - нужно require
  - util.inspect(obj, { showHidden: true, depth: 2/null,  })
  - util.format %sdj
  - util.inherits
  - посмотреть код util.js на предмет inherits (constructor)
- console
  - как работает console, если его не подключили? глобальная переменная! (их очень мало)
  - log =info идёт в stdout
  - error =warn идёт в stderr
  - trace выводит полный стек ошибки
  - используется util.format, объекты инспектятся при выводе
- EventEmitter // @ee..
  - Многие объекты наследуют EE, так что могут генерировать события
  - В отличие от браузерных событий, порядок срабатывания ограничен, можно получить список
.уе Node.JS как веб-сервер // @server

- Пример веб-сервера // @server
- Переписанный веб-сервер (события) // @server-events
- Свойства IncomingMessage (запроса)
  - url
  - headers
    - всегда lower case
  - method
- Модули url и qs  // @url
  - url разбирает URL // показать console.log разобранного урла
  - qs.parse('user[name][first]=Tobi&user[email]=tobi@learnboost.com'); // npm install qs && пример оттуда, вложенный объект в URL
- Методы ServerResponse (ответ)
  - explicit headers
    - writeHead - сразу посылает заголовок
  - implicit headers
    - statusCode
    - setHeader/removeHeader
  - write // @multi-write
  - end
    - сервер не завершит соединение без явной команды!

## Разработка и отладка под Node.JS // @dev   (supervisor, debug, log)

- Node-supervisor и аналогичные модули для разработки, их подводные камни
// Node-supervisor жрет проц на node_modules + не видит новые файлы

- Встроенный отладчик
  - node debug // @pow
- Отладка под IDE на примере Webstorm // =(модуль Node нужен?)
  - Протокол отладчика V8
    - TCP, описание протокола https://code.google.com/p/v8/wiki/DebuggerProtocol

  - node --debug   // не отреагирует на debugger, если отладчик не подключен
  - node --debug-brk // чтобы break сразу, дать возможность отладчику подключиться
- Отладка под Chrome с Node inspector
- Логирование, модуль debug
- Почему не работает? Внутри встроенных модулей. // NODE_DEBUG
- Обнаружение утечек памяти // heapdump @heap, https://github.com/bnoordhuis/node-heapdump

## Архитектура: событийный цикл Node.JS // @event-loop
- Асинхронный код: подходы
  - что, если сразу ответить на запрос не можем?
  - Пример блокирующего кода на других языках // псевдокод чтение файла, доступ к бд, обычные вычисления
  - Пример блокирующего кода на Node, демо что запросы он не принимает // @long
  - Как сделать неблокирующий код?
    - Либо Вася, который скажет о результате
    - Либо потоки
- Библиотека libuv, её устройство
  - libuv использует тредпул для файлов, асинк каллбеки для сети
// interesting: http://stackoverflow.com/questions/15526546/confusion-about-node-js-internal-asynchronous-i-o-mechanism

// https://github.com/joyent/node/pull/3872#issuecomment-7804775

- Главный цикл libuv
  - Цикл http://screencast.com/t/lnianrQW9ibx нас пробуждает ОС (событие ядра или событие JS)
  - событие ОС "есть данные для чтения" "сокет готов к записи"
  - Операции делаются, но главный поток свободен, ждёт пока что-то случится и может принимать новые запросы
- Единое адресное пространство для всех клиентов
  - разделяемые переменные // @count

## Чтение параметров из командной строки и окружения

- Запуск: чтение параметров командной строки // @run
- Переменные окружения, process.env
- Опции optimist // @run-optimist

## Работа с файлами // @file
- Модуль fs
  - Рассмотрим этот модуль чтобы еще лучше познакомиться с асинхронными операциями
- *Sync: синхронное API
  - Отдача файла // @file-sync
  - Подключение всех модулей из директории @readdirSync
- Асинхронное API
  - Соглашение о callback(err, result)
  - Более правильная отдача файла для подключения @file-async
  - Асинхронность! Вызов fs.open(file, "w", cb) ничего не делает прямо сейчас, он добавляет задачу, которая будет выполнена по освобождении

- Модуль path, сервер для файлов из директории // @path
    - Запись в файл, объект Buffer для двоичных данных
- (?) Модуль node-static (->nginx)
- Переполнение памяти или почему дружба с потоками необходима
  - почему дружба с потоками необходима
  - Выдача файла через pipe // самое быстрое и эффективное использование ресурсов
    - Пофиксить @path выше!
    - Обратим внимание, я назначаю обработчик error на fs.createReadStream(pathname), это работает т.к. реально файловая операция будет на event loop
// siege сравнил производительность sync 140 / async 211 / stream 1300

## Потоки чтения и записи
- Основные функции
  - Readable (read[bytes], events) Writable (write, ebd)
- Разбираем потоки на примере pipe
  - Вживую - стою с чайником и пытаюсь перелить его содержимое в бутылку через воронку (канал)
  - Нужно передать данные из одного места (сервер) в другое (клиент)
  - Просто передавать нельзя - воронка переполнится
  - Всё время ждать я тоже не хочу, другие дела есть
  - Но, к счастью, оба места являются потоками (readable/writeable), с событиями
  - _stream_readable.js (старый код в stream.js)
  - как только есть данные (они могут появиться в любое время, динамически) - событие source.on('readable')
  - наступление этого события означает, что данные доступны, например прочитаны по сети и сохранены в буфер ОС
  - читаем read()
  - наливаем данные во все "воронки" вызовом write
  - если write возвращает true, значит сразу записал => всё хорошо, записали и славно
  - если false, если воронка полна(buffer принадлежит writable-потоку) и он сообщит об опустении позже событием dest.on('drain'),
  -- в этом случае увеличиваем счётчик неокончивших писателей
  - ...а потом, когда каждый даст drain - читаем следующие данные (или ждём readable, если их пока нет)
  - в этом файле логика для поддержки нескольких pipe + onend + потоки могут pipe/unpipe в процессе...
  - А если поток подцепили pipe, а потом отцепили unpipe? Надоело писать. Если писателей нет, то чтение притормозится
  - А что, если a.pipe(b).pipe(c)? Можно, но b должен уметь и читать и писать (Duplex)
- Чтение POST через поток req // @post
  - Пример обработки запроса POST // @read
  - Безопасный приём POST // @read-safe
  // JSON.parse, qs.parse на большом body могут заблокировать event loop. УПС! => cluster
- Загрузка файлов с индикацией прогресса на ноде
  - node_slides.pdf в Node.JS

## Обмен сообщениями через Node.JS // @chat
- Сервер для GET/POST, вынос функций в модули
  - Пример обработки запроса POST // @read
  - Безопасный приём POST // @read-safe
- Чат на Node.JS: клиентская и серверная часть
- Интеграция сервиса на Node.JS с сайтом на другой платформе

## База MongoDB // @mongo
- Установка
- Основы использования: документы, поддокументы, запросы
  - Документы
admin = {name: "Илья", age: 31, likesMongo: true};
guest = {name: "Guest"};
  - Коллекции
db.users.insert(admin);
db.users.insert(guest);
  - Коллекции могут содержать индексы
  - Список коллекций
show collections
  - Поиск в коллекции
db.users.find();
db.users.find({ name: "Илья" })
db.users.find({ age: {$gt: 30} })
  - Типы
    http://docs.mongodb.org/manual/reference/operator/type/

  - Есть типы, которых в JS нет
  - Шпаргалка
    ?mongo booklet

- Обычно мы будем использовать Mongoose, но нативная Mongo тоже может понадобиться
- Доступ из Node // @db @find
  - Тип ObjectID, необходимость преобразования // @objectid
  - Случайная строка удобна, т.к. не позволяет например перебрать всё содержимое базы и вообще защита

## Mongoose для дружбы Node.JS и MongoDB
- Зачем Mongoose?
  - Полноценные JS-объекты с удобными методами
  - Валидация, контроль структуры данных
- Схема и модель, запросы к базе
- Формирование запроса Q -> выполнение exec/findOne/...
- Опция lean

## Удобная работа с асинхронностью
- Фреймворки Async и Q для работы с асинхронностью
- Работа с пользователями в базе при помощи Q
- Немного магии: Fibers

## Асинхнронность и таймеры
  - setImmediate uhbdyf[/Lj,hsqess.nextTick до IO // @setImmediate-...
    - setImmediate - бьём большую задачу на куски, чтобы IO не подвисал
    - nextTick - сразу после текущего JS, так как если бы это была ещё одна синхронная функция
    - nextTick - чтобы навесить обработчики ДО того, как что-то случится
  - Таймеры: setInterval/setTimeout setTimeout(.., 0) может быть вызвана как до, так и после IO
  - ref/unref // @unref, пример использования: серверу дают команду через запрос и он закрывается через 30 сек, но может и раньше

## Фреймворк Express для создания сайтов
- Создание приложения
- Архитектура фреймворка, концепция Middleware
- Разбор встроенных Middleware
  - bodyParser
  - cookieParser
  - MiddleWare может прекратить выполнение и ответить
- Создание своего Middleware
  - Middleware, который задерживает выполнение запроса на Xms
- Middleware "Роутер"
- Роуты через регулярные выражения и функции
- Middleware для параметров
- Шаблоны EJS
- Переменные уровня запроса и приложения
// просто доступны: req -> можно записать req.VAR уровня запроса
// просто доступны: req.app -> доступ к env и app.get('var') уровня приложения
// в шаблоны попадут: app.locals res.locals
// но можно что-то и в req.var записать, что не нужно в шаблоны

## Сайт на Express с использованием базы данных MongoDB + Mongoose
- Middleware для сессий
- Авторизация
// не надо генерировать сессию автоматом для каждого запроса!
- Создание сайта REST API с учётом авторизации, с использованием jQuery/Mongo/Q
- Чат с пользователями

## Технология COMET
- Клиентские средства
  - Вебсокеты для современных браузеров
  - Flashsocket
  - Server Side Events для современных браузеров
  - iframe
  - длинный XHR / длинный SCRIPT
- Socket.IO снаружи и изнутри
- Интеграция Socket.IO с приложением на Express
  - Авторизация на Socket.IO и Express
  - Веб-приложение на Node.JS + MongoDB + Express + Socket.io

// express-debug ejs-locals

Дополнительно?
=============
- Fibers
  - Основная цель -- расширение кругозора, так что общее введение в корутины, отличие от сабрутин (функций) в том, что корутины возвращают управление без заканчивания своей работы. Пример корутин - генераторы.
  - Почему не Fibers? - была статья на stackoverflow хорошая с причинами
- MySQL
- Cluster, продакшн
- Автоматизированное тестирование
  - Mocha, Chai и их друзья

===============================================

- Технология COMET [Много времени]
  - Клиентские средства
    - Вебсокеты для современных браузеров
    - Flashsocket
    - Server Side Events для современных браузеров
    - iframe
    - длинный XHR / длинный SCRIPT
  - Socket.IO снаружи и изнутри
- Интеграция Socket.IO с приложением на Express
  - Авторизация на Socket.IO и Express
  - Веб-приложение на Node.JS + MongoDB + Express + Socket.io

- Дополнительно [Если будет время]
  - Приложение побольше на Node.JS + MongoDB + Express + Socket.io

  - Интеграция Node.JS с сайтом на другой платформе
  - Фреймворки Mocha + Chai для тестирования

Для аптайма и контроля ошибок
RTFM domain
http://shapeshed.com/uncaught-exceptions-in-node/
http://blog.evantahler.com/blog/production-deployment-with-node-js-clusters.hcесо

sticky session varnish
https://www.varnish-cache.org/trac/wiki/LoadBalancing

===========

Куда идти даDsltкодkpеcЗадачиpПришло