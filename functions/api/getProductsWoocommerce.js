var clientkey = "miura";
var secret = "!Exito!2020!";

export async function onRequestPost({ request }) {
  return new Response(`Hello world`);
}

export async function onRequestGet(request) {

  var query = `query NewQuery {
        products {
          nodes {
            ... on VariableProduct {
              id
              name
              variations {
                nodes {
                  name
                  price
                  databaseId
                  sku
                  attributes {
                    nodes {
                      name
                      value
                    }
                  }
                  image {
                    sourceUrl
                  }
                }
              }
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
  data = await data.json()
  if (data.data?.products?.nodes) data = data.data.products.nodes;
  else return Response.json({
    error: 500
  });
  data = data.map(function (e) {
    if (!e.variations?.nodes) return []
    return e.variations.nodes
  }).flat();
  data = data.map(function (e) {
    return { databaseId: e.databaseId }
  })
  return Response.json({
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic ' + btoa(clientkey + ":" + secret)
    }
  });
}
