function saveOptions(e) {
  e.preventDefault();
  var selectElement = document.getElementById('sel1')
  var address = selectElement.options[ selectElement.selectedIndex ].value
  var isChecked = document.getElementById('cmn-toggle-1').checked;
  chrome.storage.local.set({
    address: address
  });
  chrome.storage.local.set({
    insert: isChecked
  });
}

/**
 * Makes a post request to the wallet to get one of the users wallet addresses
 * @return {string} wallet address
 */
function getAddressFromWallet(){
  $.ajax({
  	type: "POST",
  	url: "http://username:password@127.0.0.1:43814",
  	data: '{"method": "listreceivedbyaddress", "params":[0,true]}',
  	dataType: "json",
  	contentType: "application/json-rpc;",
  	success: function(response) {
      if(response.result !== undefined){
        addOptionsToSelect(response.result);
        selectPreviousAddress();
      }
      else{
        console.log("nooo");
      }
      //return response.result[0].address;
  	},
  	error: function(xhr, textStatus, errorThrown) {
  		console.log("Error getting address from wallet. Is your wallet on and setup?");
  	}
  });
}

function addOptionsToSelect(optionsArray){
  select = document.getElementById('sel1');

  for (var i = 0; i < optionsArray.length; i++){
    addOptionToSelect(select, optionsArray[i].address)
  }
}

function addOptionToSelect(selectElement, newOption){
  var opt = document.createElement('option');
  opt.value = newOption;
  opt.innerHTML = newOption;
  select.appendChild(opt);
}

function selectPreviousAddress(){
  function setCurrentChoice(result) {
    if(result !== undefined && result.address !== undefined && result.address !== ""){
      var select = document.getElementById('sel1').value = result.address;
    }
    else{
      console.log("No Saved Address Found");
      return null;
    }
  }

  chrome.storage.local.get("address",setCurrentChoice);
}

function restoreSettings(){
  function setCurrentChoice(result) {
    if(result !== undefined && result.insert !== undefined && result.insert !== ""){
      document.getElementById('cmn-toggle-1').checked = result.insert;
    }
    else{
      console.log("No Settings Found");
      return null;
    }
  }

  chrome.storage.local.get("insert",setCurrentChoice);
}

/**
 * TODO: Finish function
 * Generates and gets a new address from the users wallet.
 * @return {string} new wallet address
 */
function generateNewAddress(){
  $.ajax({
    type: "POST",
    url: "http://username:password@127.0.0.1:43814",
    data: '{"method": "getnewaddress", "params":[]}',
    dataType: "json",
    contentType: "application/json-rpc;",
    success: function(response) {
      //use a timeout so the loader has a chance to fire
      console.log(response);
      select = document.getElementById('sel1');
      addOptionToSelect(select, response.result);
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log(xhr);
    }
  });
}

window.onload = function() {
      document.getElementById("addNewButton").addEventListener("click", generateNewAddress);
      document.getElementById("cmn-toggle-1").addEventListener("change", saveOptions);
      document.getElementById('sel1').addEventListener("change", saveOptions);
      getAddressFromWallet();
      restoreSettings();
};
