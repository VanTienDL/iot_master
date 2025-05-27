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

// Khi có client kết nối
io.on('connection', (socket) => {
  console.log('🔌 Client đã kết nối:', socket.id);

  // Nhận yêu cầu từ client
  socket.on('stop-buzzer', () => {
    console.log('🛑 Yêu cầu tắt còi');
    // Gửi tới các thiết bị nếu có (hoặc log)
  });

  socket.on('toggle-water', () => {
    console.log('💧 Yêu cầu bật/tắt tưới');
    // Gửi tín hiệu điều khiển đến thiết bị thực (nếu có)
  });

  // Giả lập gửi dữ liệu cảm biến mỗi vài giây (nếu chưa có thiết bị thật)
  setInterval(() => {
    socket.emit('dht', { temp: (20 + Math.random() * 10).toFixed(1), humi: (50 + Math.random() * 20).toFixed(1) });
    socket.emit('soil', Math.random() > 0.5 ? 'Khô' : 'Ẩm');
    socket.emit('fire', Math.random() < 0.1); // 10% báo cháy
    socket.emit('watering', Math.random() > 0.5); // ngẫu nhiên bật/tắt tưới
    socket.emit('key', Math.ceil(Math.random() * 8).toString()); // mô phỏng bấm phím
  }, 3000);
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
