import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const useSocketSetup = () => {
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        let socket;
        
        if (user) {
            // Establish socket connection
            socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
                query: {
                    userId: user._id
                }
            });

            socket.on("notification", (data) => {
                toast(data.message, {
                    style: {
                        background: data.type === 'accepted' ? '#10b981' : data.type === 'rejected' ? '#ef4444' : '#6366f1',
                        color: 'white',
                        border: 'none',
                    }
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("notification");
                socket.disconnect();
            }
        }
    }, [user]);

}

export default useSocketSetup;
