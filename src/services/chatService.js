/**
 * Chat Service
 * Handles communication with the backend (Official WhatsApp API / Evolution API)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const chatService = {
    /**
     * Send a text message
     * @param {string} to - Phone number
     * @param {string} text - Message content
     */
    sendMessage: async (to, text) => {
        try {
            // In a real scenario, this would call your backend which then calls WhatsApp API
            // For MVP/Demo without backend, we might simulate or call Cloud Function directly

            console.log(`Sending message to ${to}: ${text}`);

            // Simulation for "Test in Practice" without full backend setup yet
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: Date.now().toString(),
                        text,
                        sender: 'me',
                        timestamp: new Date().toISOString(),
                        status: 'sent'
                    });
                }, 500);
            });

            /* 
            // Real Implementation Example:
            const response = await fetch(`${API_URL}/messages/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ to, text })
            });
            return await response.json();
            */
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    /**
     * Get chat history for a contact
     * @param {string} contactId 
     */
    getHistory: async (contactId) => {
        // Mock history
        return [
            {
                id: '1',
                text: 'Olá! Como posso ajudar com a EsferaZap hoje?',
                sender: 'other',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
                id: '2',
                text: 'Gostaria de saber mais sobre os planos.',
                sender: 'me',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            }
        ];
    }
};
