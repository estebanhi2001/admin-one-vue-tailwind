
export async function onRequestPost({ request }) {
    let body = await request.json();

    let formData = new FormData();
    formData.append('chat_id', '-1001827835379');
    formData.append('parse_mode', 'HTML');
    let comprador = [body.billing.first_name, body.billing.last_name].join(" ")
    let direccion = [body.billing.address_1, body.billing.address_2, body.billing.city, body.billing.state].join(" ")

    let mensaje = `Se ha realizado un pedido en <a href='https://www.miura.cl/wp-admin/post.php?post=${body.id}&action=edit'>miura.cl</a>
<b>Comprador:</b> ${comprador}
<b>Dirección:</b> ${direccion}
<b>Contacto:</b> ${body.billing.email ?? ''} ${body.billing.phone ?? ''}
<b>Pago:</b> ${body.payment_method_title}`
    console.log(mensaje)
    formData.append('text', mensaje);

    let loge = await fetch('https://api.telegram.org/bot5679049293:AAH_n--foTUy1i6d26E9qXXiOoc9yKyI8U8/sendMessage', {
        method: 'POST',
        body: formData
    })

    console.log(await loge.json())



    return Response.json(200);
}
