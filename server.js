const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// URL для получения токена
const LOGIN_URL = 'http://127.0.0.1:9042/api/login/2050';
// URL для получения kitchenorders
const KITCHEN_ORDERS_URL = 'http://127.0.0.1:9042/api/kitchenorders';

app.use(cookieParser());
app.use(cors());

let globalToken = null; // Глобальная переменная для хранения токена

async function getToken() {
    try {
        const response = await axios.get(LOGIN_URL);
        console.log('Ответ от сервера:', response.data); // Добавьте эту строку для логирования
        return response.data; // Предполагаем, что токен находится в ответе
    } catch (error) {
        console.error('Ошибка при получении токена:', error);
        return null;
    }
}

async function getKitchenOrders(token) {
    try {
        const response = await axios.get(KITCHEN_ORDERS_URL, {
            headers: {
                'Cookie': `key=${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении kitchen orders:', error);
        return null;
    }
}

async function getKitchenOrderDetails(token, id) {
    try {
        const response = await axios.get(`${KITCHEN_ORDERS_URL}/${id}`, {
            headers: {
                'Cookie': `key=${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении деталей kitchen order:', error);
        return null;
    }
}

app.get('/status/:guid', async (req, res) => {
    const { guid } = req.params;
    let key = req.cookies.key || globalToken;

    if (!key) {
        key = await getToken();
        if (key) {
            globalToken = key; // Сохраняем токен в глобальную переменную
            res.cookie('key', key, { maxAge: 900000, httpOnly: true, path: '/' }); // Сохраняем токен в куки на 15 минут
        } else {
            return res.status(500).send('Не удалось получить токен');
        }
    }

    const kitchenOrders = await getKitchenOrders(key);
    if (!kitchenOrders) {
        return res.status(500).send('Не удалось получить kitchen orders');
    }

    const order = kitchenOrders.find(order => order.BaseOrder.endsWith(`/api/orders/${guid}`));
    if (!order) {
        return res.status(404).send('Заказ не найден');
    }

    const kitchenOrderId = order.Url.split('/').pop();
    const kitchenOrderDetails = await getKitchenOrderDetails(key, kitchenOrderId);
    if (!kitchenOrderDetails) {
        return res.status(500).send('Не удалось получить детали kitchen order');
    }

    res.json(kitchenOrderDetails);
});

async function refreshToken() {
    globalToken = await getToken();
    if (globalToken) {
        console.log('Токен обновлен:', globalToken);
    } else {
        console.error('Не удалось обновить токен');
    }
}

app.listen(PORT, async () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    await refreshToken(); // Получаем токен при запуске сервера
    setInterval(refreshToken, 1800000); // Обновляем токен каждые 30 минут (1800000 миллисекунд)
});