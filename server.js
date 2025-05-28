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

  // Nếu là local server kết nối lên master (dựa trên một tín hiệu riêng)
  socket.on('register-local', () => {
    localClients.push(socket);
    console.log('✅ Đã đăng ký local server:', socket.id);
  });

  socket.on('stop-buzzer', () => {
    console.log('🛑 Yêu cầu tắt còi');

    // Gửi lệnh ngược lại cho local server
    localClients.forEach((client) => client.emit('stop-buzzer'));
  });

  socket.on('toggle-water', () => {
    console.log('💧 Yêu cầu bật/tắt tưới');

    // Gửi lệnh ngược lại cho local server
    localClients.forEach((client) => client.emit('toggle-water'));
  });

  // Xóa client nếu ngắt kết nối
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
