const { ApiError } = require("square");

async function listCatalog(client, type) {
    try {
        // The undefined parameter is cursor, which is not needed
        const listCatalogResponse = await client.catalogApi.listCatalog(undefined, type);
        const catalogObjects = listCatalogResponse.result.objects;
        return catalogObjects;
    } catch (error) {
        if (error instanceof ApiError) {
            error.result.errors.forEach(function (e) {
                console.log(e.category);
                console.log(e.code);
                console.log(e.detail);
            }); 
        } else {
            console.log("Unexpected error occurred: ", error);
        }        
    }
}

module.exports = ("listCatalog", listCatalog);