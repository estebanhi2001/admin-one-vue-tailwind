export async function onRequestGet({ request }) {
    return new Response(`
    sudo systemctl status ssh
        `);
}