
export async function onRequestPost({ request }) {
    let formData = new FormData();
    formData.append('chat_id', '-1001827835379');
    formData.append('caption', 'Enviado desde WebHook MLC');
    let requestjson = await request.json();
    formData.append('document', new Blob([JSON.stringify(requestjson)]), "info.txt");

    let responselog = await fetch('https://api.telegram.org/bot5679049293:AAH_n--foTUy1i6d26E9qXXiOoc9yKyI8U8/sendDocument', {
        method: 'POST',
        body: formData
    })
    console.log(JSON.stringify(requestjson))
    console.log(await responselog.json())



    return Response.json(200);
}
