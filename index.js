require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3002;

// Инициализируем Supabase клиент
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/sneakers', async (req, res) => {
  try {
    const { data: Sneakers, error } = await supabase
      .from('Sneakers')
      .select('*');

    if (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(Sneakers);
    }
  } catch (error) {
    console.warn('no sneakers', error);
  }
});

app.get('/basket', async (req, res) => {
  try {
    const { data: Baskets, error } = await supabase.from('Baskets').select('*');

    if (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(Baskets);
    }
  } catch (error) {
    console.warn('Error fetching the basket', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/favorites', async (req, res) => {
  try {
    const { data: Favorites, error } = await supabase
      .from('Favorites')
      .select('*');

    if (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(Favorites);
    }
  } catch (error) {
    console.warn('Error fetching the favorite', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Orders').select('*');
    if (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.warn('Error fetching the order', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/sneakers', async (req, res) => {
  const { id, title, price, imageUrl } = req.body;

  try {
    const { data, error } = await supabase.from('Baskets').upsert([
      {
        title,
        price,
        imageUrl,
        sneakerId: id,
      },
    ]);
    if (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
  }
});

app.post('/favorites', async (req, res) => {
  const { id, title, price, imageUrl } = req.body;
  try {
    const { data, error } = await supabase.from('Favorites').upsert([
      {
        title,
        price,
        imageUrl,
        sneakerId: id,
      },
    ]);
    if (error) {
      console.error('Ошибка при добавлении товара в favorite:', error);
      res
        .status(500)
        .json({ error: 'Ошибка при добавлении товара в favorite' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении товара в favorite' });
  }
});

app.post('/orders', async (req, res) => {
  const orders = req.body;
  try {
    const database = await supabase
      .from('OrderIds')
      .upsert([
        {
          name: 'Alex',
          tel: '789456133',
        },
      ])
      .select();

    const orderIdFromBack = database.data[0].id;

    const orderData = orders.map((order) => ({
      title: order.title,
      price: order.price,
      imageUrl: order.imageUrl,
      sneakerId: order.sneakerId,
      orderId: orderIdFromBack,
    }));

    const { data, error } = await supabase
      .from('Orders')
      .upsert(orderData)
      .select();

    if (error) {
      console.error('Ошибка при добавлении товара в orders:', error);
      res.status(500).json({ error: 'Ошибка при добавлении товара в orders' });
    } else {
      res.status(200).json({ idOrder: orderIdFromBack, order: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении товара в orders' });
  }
});

app.delete('/basket', async (req, res) => {
  try {
    const { error } = await supabase.from('Baskets').delete().neq('id', 0);
    if (error) {
      console.error('Ошибка при очистке корзины:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.status(200).json({ message: 'Basket is cleared' });
    }
  } catch (error) {
    console.warn('Error clearing the basket', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/basket/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('Baskets')
      .delete()
      .eq('sneakerId', id);
    if (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
      res.status(500).json({ error: 'Ошибка при удалении товара из корзины' });
    } else {
      res.status(200).json({ message: 'Товар успешно удален из корзины' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении товара из корзины' });
  }
});

app.delete('/favorites/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('Favorites')
      .delete()
      .eq('sneakerId', id);
    if (error) {
      console.error('Ошибка при удалении товара из favorite:', error);
      res.status(500).json({ error: 'Ошибка при удалении товара из favorite' });
    } else {
      res.status(200).json({ message: 'Товар успешно удален из favorite' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении товара из favorite' });
  }
});

app.listen(PORT, () => {
  console.log(`Server starting on PORT ${PORT}`);
});
