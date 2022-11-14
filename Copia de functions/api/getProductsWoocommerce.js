var clientkey = "miura";
var secret = "!Exito!2020!";

export async function onRequestPost({ request }) {
    return new Response(`Hello world`);
}

export async function onRequestGet(request) {

    var query = `query NewQuery {
        products(where: {include: 12588}) {
          nodes {
            ... on VariableProduct {
              id
              name
              variations {
                nodes {
                  name
                  price
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
    return Response.json({
        request,
        data,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + btoa(clientkey + ":" + secret)
        }
    });
}
