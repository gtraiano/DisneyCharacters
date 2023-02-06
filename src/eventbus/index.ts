type EventKey = string;
type EventHandler = (payload?: any) => void;

interface EventBus {
    on: (event: EventKey, callback: EventHandler) => void,      // add listener
    once: (event: EventKey, callback: EventHandler) => void,    // handler will be invoked only once
    emit: (event: EventKey, data: any) => void,                 // dispatch event
    off: (event: EventKey, callback: EventHandler) => void      // remove listener
};

const eventBus: EventBus = {
    on(event, callback) {
        document.addEventListener(event, callback);
    },

    once(event, callback) {
        document.addEventListener(event, callback, { once: true });
    },
  
    emit(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
  
    off(event, callback) {
      document.removeEventListener(event, callback);
    }
};

export default eventBus;