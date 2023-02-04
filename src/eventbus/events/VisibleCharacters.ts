// custom event to dispatch when visible characters on table change
// used to pass character id's
export const VisibleCharacters = {
    eventName: 'visibleCharacters',
    //dispatch: (detail: number[]) => (e?: HTMLElement) => { (e ?? document).dispatchEvent(new CustomEvent(VisibleCharacters.eventName, { bubbles: true, detail })) }
};
