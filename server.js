import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Đường dẫn tới thư mục public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Danh sách client
let localClients = [];
let uiClients = [];

io.on('connection', (socket) => {
  console.log('🔌 Client đã kết nối:', socket.id);

  // Đăng ký client là local server
  socket.on('register-local', () => {
    localClients.push(socket);
    console.log('✅ Đăng ký local server:', socket.id);
  });

  // Đăng ký client là giao diện (UI)
  socket.on('register-ui', () => {
    uiClients.push(socket);
    console.log('🖥️ Đăng ký giao diện web:', socket.id);
  });

  // === NHẬN DỮ LIỆU TỪ LOCAL SERVER VÀ GỬI CHO UI CLIENT ===
  socket.on('sensor-data', (data) => {
  console.log('📡 Nhận dữ liệu từ local server:', data);
  
  uiClients.forEach(client => {
    if(data.temp && data.humi) client.emit('dht', { temp: data.temp, humi: data.humi });
    if(data.soil !== undefined) client.emit('soil', data.soil);
    if(data.fire !== undefined) client.emit('fire', data.fire);
    if(data.watering !== undefined) client.emit('watering', data.watering);
    if(data.light !== undefined) client.emit('light', data.light);
    if(data.buzzer !== undefined) client.emit('buzzer', data.buzzer);
    if(data.key) client.emit('key', { key: data.key });
  });
});


  // === XỬ LÝ LỆNH TỪ UI GỬI TỚI LOCAL SERVER ===

  // Buzzer
  socket.on('start-buzzer', () => {
    console.log('🔊 Bật còi');
    localClients.forEach((client) => client.emit('start-buzzer'));
  });

  socket.on('stop-buzzer', () => {
    console.log('🛑 Tắt còi');
    localClients.forEach((client) => client.emit('stop-buzzer'));
  });

  socket.on('auto-buzzer', () => {
    console.log('🔁 Còi tự động');
    localClients.forEach((client) => client.emit('auto-buzzer'));
  });

  // Light
  socket.on('start-light', () => {
    console.log('💡 Bật đèn');
    localClients.forEach((client) => client.emit('start-light'));
  });

  socket.on('stop-light', () => {
    console.log('💡 Tắt đèn');
    localClients.forEach((client) => client.emit('stop-light'));
  });

  socket.on('auto-light', () => {
    console.log('💡 Đèn tự động');
    localClients.forEach((client) => client.emit('auto-light'));
  });

  // Pump
  socket.on('start-pump', () => {
    console.log('💧 Bật bơm');
    localClients.forEach((client) => client.emit('start-pump'));
  });

  socket.on('stop-pump', () => {
    console.log('💧 Tắt bơm');
    localClients.forEach((client) => client.emit('stop-pump'));
  });

  socket.on('auto-pump', () => {
    console.log('💧 Bơm tự động');
    localClients.forEach((client) => client.emit('auto-pump'));
  });

  // Auto toàn hệ thống
  socket.on('auto-all', () => {
    console.log('⚙️ Toàn hệ thống sang chế độ tự động');
    localClients.forEach((client) => client.emit('auto-all'));
  });

  // === NGẮT KẾT NỐI ===
  socket.on('disconnect', () => {
    localClients = localClients.filter((client) => client.id !== socket.id);
    uiClients = uiClients.filter((client) => client.id !== socket.id);
    console.log('❌ Client đã ngắt kết nối:', socket.id);
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
