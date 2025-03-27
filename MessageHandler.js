export default class MessageHandler {
    #destination;
    #sceneSynchronizer;

    constructor ( destination ) {
		console.log("MessageHandler - constructor");
        this.#destination = destination;
        
        window.addEventListener("message", (message) => {
            this.#receiveMessage(message);
        });
    }

    setSynchronizer ( sceneSynchronizer ) {
		console.log("MessageHandler - setSynchronizer");
        this.#sceneSynchronizer = sceneSynchronizer;
        this.#sceneSynchronizer.setMessageHandler(this);
    }

    #receiveMessage ( message ) {
		console.log("MessageHandler - #receiveMessage");
        console.log(message);
        const data = message.data;
        this.#sceneSynchronizer.receiveMessage(data);
    }

    emitMessage ( message ) {
		console.log("MessageHandler - emitMessage");
        this.#destination.postMessage(message);
        console.log(message);
    }
}