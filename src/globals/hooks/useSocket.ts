// import { baseURL } from "@utils/constants";
// import { useCallback, useEffect, useState } from "react";
// import SocketIOClientStatic from "socket.io-client";

// export const useSocket = (isReady: boolean, query: Record<string, unknown> = {}) => {
//   const [socket, setSocket] = useState<SocketIOClientStatic["Socket"] | null>(null);

//   useEffect(() => {
//     let s = null;
//     if (!socket && isReady) {
//       s = SocketIOClientStatic(baseURL, {
//           autoConnect: false,
//           transports: ["websocket"],
//           rejectUnauthorized: false,
//           query: { ...query },
//         });
//       setSocket(s);
//       s.connect();
//     }

//     return () => {
//       s?.disconnect();
//       setSocket(null);
//     };
//   }, [isReady]);

//   const sendToSocket = useCallback((event: string, data: Record<string, unknown>) => {
//     if (!socket) return () => {};
//     socket.emit(event, data);
//   }, [socket]);

//   const listenToSocket = useCallback((event: string, callback: (data: Record<string, unknown>) => void) => {
//     if (!socket) return () => {};
//     socket.on(event, callback);

//     return () => {
//       socket.off(event, callback);
//     }
//   }, [socket]);

//   return { listenToSocket, sendToSocket, socket };
// };
