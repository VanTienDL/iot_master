import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Trỏ về đúng thư mục public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Giữ danh sách các client kết nối, bao gồm cả local server
let localClients = [];

io.on('connection', (socket) => {
  console.log('🔌 Client đã kết nối:', socket.id);

  // Nếu là local server đăng ký
  socket.on('register-local', () => {
    localClients.push(socket);
    console.log('✅ Đã đăng ký local server:', socket.id);
  });

  // Buzzer
  socket.on('stop-buzzer', () => {
    console.log('🛑 Yêu cầu tắt còi');
    localClients.forEach((client) => client.emit('stop-buzzer'));
  });

  socket.on('start-buzzer', () => {
    console.log('🔊 Yêu cầu bật còi');
    localClients.forEach((client) => client.emit('start-buzzer'));
  });

  socket.on('auto-buzzer', () => {
    console.log('🔁 Yêu cầu chuyển còi sang tự động');
    localClients.forEach((client) => client.emit('auto-buzzer'));
  });

  // Light
  socket.on('stop-light', () => {
    console.log('💡 Yêu cầu tắt đèn');
    localClients.forEach((client) => client.emit('stop-light'));
  });

  socket.on('start-light', () => {
    console.log('💡 Yêu cầu bật đèn');
    localClients.forEach((client) => client.emit('start-light'));
  });

  socket.on('auto-light', () => {
    console.log('💡 Yêu cầu chuyển đèn sang tự động');
    localClients.forEach((client) => client.emit('auto-light'));
  });

  // Pump
  socket.on('stop-pump', () => {
    console.log('💧 Yêu cầu tắt bơm');
    localClients.forEach((client) => client.emit('stop-pump'));
  });

  socket.on('start-pump', () => {
    console.log('💧 Yêu cầu bật bơm');
    localClients.forEach((client) => client.emit('start-pump'));
  });

  socket.on('auto-pump', () => {
    console.log('💧 Yêu cầu chuyển bơm sang tự động');
    localClients.forEach((client) => client.emit('auto-pump'));
  });

  // Auto all
  socket.on('auto-all', () => {
    console.log('⚙️ Yêu cầu chuyển toàn hệ thống sang tự động');
    localClients.forEach((client) => client.emit('auto-all'));
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    localClients = localClients.filter((client) => client.id !== socket.id);
    console.log('❌ Client đã ngắt kết nối:', socket.id);
  });
});



// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
