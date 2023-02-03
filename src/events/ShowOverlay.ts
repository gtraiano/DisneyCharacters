// custom event to dispatch to show content in overlay
// to be used for showing character information in overlay
// necessary because computedValue in CharactersTableProps does not receive a callback
export const ShowOverlay = {
    eventName: 'showOverlay',
    dispatch: (detail: any) => (e?: HTMLElement) => { (e ?? document).dispatchEvent(new CustomEvent('showOverlay', { bubbles: true, detail })) }
};