type EventKey = string;
type EventHandler = (payload?: any) => void;

interface EventBus {
    on: (event: EventKey, callback: EventHandler) => void,  // add listener
    emit: (event: EventKey, data: any) => void,             // dispatch event
    off: (event: EventKey, callback: EventHandler) => void  // remove listener
};

const eventBus: EventBus = {
    on(event, callback) {
        document.addEventListener(event, callback);
    },
  
    emit(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
  
    off(event, callback) {
      document.removeEventListener(event, callback);
    }
};

export default eventBus;