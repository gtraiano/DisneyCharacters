// custom event to dispatch to show content in overlay
// to be used for showing character information in overlay
// necessary because computedValue in CharactersTableProps does not receive a callback
export const ShowModal = {
    eventName: 'showModal',
    //dispatch: (detail: any) => (e?: HTMLElement) => { (e ?? document).dispatchEvent(new CustomEvent(ShowModal.eventName, { bubbles: true, detail })) }
};