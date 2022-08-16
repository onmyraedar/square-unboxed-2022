import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function SelectCatalogItemStep(props) {
  const { activeCatalogItem, catalogItemOptions, handleCatalogItemChange } = props;

  function getCatalogItem(catalogObjectID) {
    const catalogItem = catalogItemOptions.find(
      (item) => item.catalogObjectID === catalogObjectID
    );
    if (catalogItem) {
      return catalogItem;
    } else {
      return null;
    }
  }  

  return(
    <div>
      <Autocomplete 
        autoHighlight
        disablePortal
        id="catalog-item-autocomplete"
        isOptionEqualToValue={(option, value) => option.catalogObjectID === value.catalogObjectID}
        onChange={handleCatalogItemChange}
        options={catalogItemOptions.sort((a, b) => a.label.localeCompare(b.label, "en", {ignorePunctuation: true}))}
        renderInput={(params) => <TextField {...params} label="Choose a catalog item" />}
        value={getCatalogItem(activeCatalogItem.catalogObjectID)}
      /> 
    </div>
  );
}

export default SelectCatalogItemStep;