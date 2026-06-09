import { socketService } from "@/infra/services/socket/socket.io";

// Inicia o servidor (Socket + Express)
socketService.listen();