var clientkey = "miura";
var secret = "!Exito!2020!";

export async function onRequestPost({ request }) {
  return new Response(`Hello world`);
}

export async function onRequestGet({ params }) {

  const productID = parseInt(params.product)
  if (isNaN(productID)) {
    return Response.json({ error: "ID no válido" }, { status: 400 });
  }

  var query = `query NewQuery {
    products(where: {include: ${productID}}) {
      nodes {
        ... on VariableProduct {
          name
          variations {
            nodes {
              name
              price(format: RAW)
              sku
              attributes {
                nodes {
                  name
                  value
                  label
                }
              }
              image {
                sourceUrl
              }
              databaseId
              stockQuantity
            }
          }
          databaseId
        }
      }
    }
  }`;
  let data = await fetch('https://www.miura.cl/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic ' + btoa(clientkey + ":" + secret)
    },
    body: JSON.stringify({
      query
    })
  })
  data = await data.json(
  )
  if (!data.data?.products?.nodes?.[0]) return Response.json({ error: "No encontrado" }, { status: 404 });
  else data = data.data.products.nodes[0]
  let variantes = Object.fromEntries(new Map(data.variations.nodes.map(element => [element.databaseId, element])))
  for (let vari in variantes) {
    for (let atri of variantes[vari].attributes.nodes) {
      if (atri.name == 'pa_color') variantes[vari]['Color'] = atri.value
      if (atri.name == 'pa_tallas') variantes[vari]['Talla'] = atri.value
    }
  }
  return Response.json({
    nombre: data.name,
    databaseId: data.databaseId,
    variantes: variantes
  });
}
