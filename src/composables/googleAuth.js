export function renderGoogleButton(targetElement, onCredential) {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.error("Google Identity Services script has not loaded yet.");
        return;
    }

    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
    });

    window.google.accounts.id.renderButton(targetElement, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        width: 280,
    });
}
