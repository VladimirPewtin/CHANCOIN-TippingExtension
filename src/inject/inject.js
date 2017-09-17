chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      var mutationObserver = window.MutationObserver;
      var myObserver       = new mutationObserver (mutationHandler);
      var obsConfig        = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['class']
      };

      myObserver.observe (document, obsConfig);
    }
  }, 10);
});

function test(){
$.ajax({
	type: "POST",
	url: "http://username:password@127.0.0.1:43814",
	data: '{"method": "listreceivedbyaddress", "params":[0,true]}',
	dataType: "json",
	contentType: "application/json-rpc;",
	success: function(response) {
		//use a timeout so the loader has a chance to fire
		console.log(response);
		console.log(response.result[0].address);
		var tmp = document.getElementById("qr").children[1].children[0].children[2];
		tmp.value = "$4CHN:" + response.result[0].address;
	},
	error: function(xhr, textStatus, errorThrown) {
		console.log(xhr);
	}
});
}

function test2(){
$.ajax({
  type: "POST",
  url: "http://username:password@127.0.0.1:43814",
  data: '{"method": "listreceivedbyaddress", "params":["0","True"]}',
  dataType: "json",
  contentType: "application/json-rpc;",
  success: function(response) {
    //use a timeout so the loader has a chance to fire
    console.log(response);
  },
  error: function(xhr, textStatus, errorThrown) {
    console.log(xhr);
  }
});

$.ajax({
  type: "POST",
  url: "http://username:password@127.0.0.1:43814",
  data: '{"method": "getnewaddress", "params":[]}',
  dataType: "json",
  contentType: "application/json-rpc;",
  success: function(response) {
    //use a timeout so the loader has a chance to fire
    console.log(response);
  },
  error: function(xhr, textStatus, errorThrown) {
    console.log(xhr);
  }
});
}

/**
 * Adds the tip poster button to the menu.
 * Specific for vanilla 4chan compatibility
 * @return void
 */
function addButton() {
  // TODO Refactor this into a predicate
  if( getPostAddress().toLowerCase().startsWith("$4chn:") ||
      getPostAddress().toLowerCase().startsWith("$4CHN:") ||
      getPostAddress().toLowerCase().startsWith("$CHAN:") ||
      getPostAddress().toLowerCase().startsWith("$chan:") ) {

    var a = document.getElementById("post-menu").children[0];
    var b = document.createElement("li");
    b.innerHTML = "<img src='http://i.imgur.com/sh8aYT1.png' style='width:15px;vertical-align:middle'/>  Tip poster";
    b.addEventListener("click", send4CHN);
    a.appendChild(b);
  }
}

/**
 * Adds the tip poster button to the menu.
 * Specific for 4chanX compatibility
 * @return void
 */
function addButtonX() {
  // TODO Refactor this into a predicate (and de-dupe it if possible)
  if( getPostAddressX().toLowerCase().startsWith("$4chn:") ||
      getPostAddressX().toLowerCase().startsWith("$4CHN:") ||
      getPostAddressX().toLowerCase().startsWith("$CHAN:") ||
      getPostAddressX().toLowerCase().startsWith("$chan:") ) {
    if(document.getElementById("tipPoster") === null) {

      var a = document.getElementById("menu");
      var b = document.createElement("a");
      b.id = "tipPoster";
      b.className += ' entry';
      b.click = "send4CHN()";
      b.onmouseout  = removeFocus;
      b.onmouseover = addFocus;
      b.innerHTML = "<img src='http://i.imgur.com/sh8aYT1.png' style='width:15px;vertical-align:middle' />  Tip poster";
      b.addEventListener("click", send4CHN);
      a.appendChild(b);
    }
  }
}

/**
 * Clears the Focused class from all child nodes in the menu element.
 * @return void
 */
function clearFocusedClassFromMenu(){
  var childNodes = document.getElementById("menu").children;

  for (var J = 0, L = childNodes.length;  J < L;  ++J) {
    if(childNodes[J].className.includes("focused")){
      setFocus(childNodes[J], false);
    }
  }
}

/**
 * Adds Focus to the tipPoster element
 * @return void
 */
function addFocus(){
  clearFocusedClassFromMenu();
  setFocus(document.getElementById("tipPoster"), true);
}

/**
 * Removes Focus to the tipPoster element
 * @return void
 */
function removeFocus(){
  setFocus(document.getElementById("tipPoster"), false);
}

/**
 * adds or removes the 'focused' class from the passed in element depending on the isFocued parameter.
 * @param {Element} element
 * @param {boolean} isFocued
 * @return {Number} sum
 */
function setFocus(element, isFocus){
  if(isFocus){
    element.className += " focused";
  } else{
    element.className = element.className.replace(" focused", "");
  }
}


/**
 * Returns the address, which should be the portion of the post name following
 * the colon.
 * @param {string} postName
 * @return {string} address
 */
function addressFromPostName(postName) {
  return postName.split(':')[1];
}

/**
 * Sends 4CHN to the posters address. The method takes advantage of the sweetalert
 * modal windows to collect and display information to the user.
 * @param {string} address
 * @param {Number} amount
 * @return {Number} sum
 */
function send4CHN(address, amount) {
  var postAddress = getPostAddress();
  if(postAddress === null){
    postAddress = getPostAddressX();
  }

  address = addressFromPostName(postAddress.replace(/\s+/g, ''));

  swal({
    title: "Tip a poster",
    text: "How much 4CHN would you like to send to " + address + "?",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Number of coins",
    showLoaderOnConfirm: true,
  },
       function(inputValue){

         //did user cancel
         if(inputValue === false){
           return;
         }

         if(inputValue==="" || /^\D+$/.test(inputValue)) {
           //use a timeout so the loader has a chance to fire
           setTimeout(function(){
             swal("Error!", "Please enter a number.", "error");
           }, 500);
         }
         else if(parseFloat(inputValue) < 0.00000001) {
           //use a timeout so the loader has a chance to fire
           setTimeout(function(){
             swal("Error!", "Value must be greater than or equal to 0.00000001.", "error");
           }, 500);
         }
         else if(inputValue!==null) {

           $.ajax({
             type: "POST",
             url: "http://username:password@127.0.0.1:43814",
             data: '{"method": "sendtoaddress", "params":["' + address + '",' + inputValue  + ',"A tip for post #' + postNum + '."]}',
             dataType: "json",
             contentType: "application/json-rpc;",
             success: function(response) {
               //use a timeout so the loader has a chance to fire
               setTimeout(function(){
                 if(response.error !== null) {
                   swal("Error!", "There was an error sending the coins", "error");
                 }
                 else {
                   swal("Success!", "You sent " + inputValue + " 4CHN to " + address + ".", "success");
                 }
               }, 500);

             },
             error: function(xhr, textStatus, errorThrown) {
               swal("Error!", "There was an error sending the coins", "error");
             }
           });
         }
       });
}

/**
 * Searchs the elements for the posters address.
 * To be used with vanilla 4chan.
 * @return {string} postAddress
 */
function getPostAddress() {
  try {
    postNum = document.getElementById("post-menu").children[0].children[0].getAttribute("data-id");
    return document.getElementById("pc" + document.getElementById("post-menu").children[0].children[0].getAttribute("data-id")).getElementsByClassName("name")[1].innerText;
  } catch(e) {
    if (e instanceof TypeError) {
      // statements to handle TypeError exceptions
      return null;
    }
  }
}

/**
 * Searchs the elements for the posters address.
 * To be used with 4chanX.
 * @return {string} postAddress
 */
function getPostAddressX(){
  postNum = document.getElementById("menu").parentNode.parentNode.children[0].name;
  return document.getElementById("menu").parentNode.parentNode.getElementsByClassName("name")[0].innerText;
}

/**
 * Adds two numbers
 * @param {mutationRecords} mutationRecords
 * @return void
 */
function mutationHandler (mutationRecords) {
  mutationRecords.forEach ( function (mutation) {
    if (mutation.type == "childList" && typeof mutation.addedNodes  == "object" && mutation.addedNodes.length) {
      for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
        checkForCSS_Class (mutation.addedNodes[J], "dd-menu");
        checkForCSS_Class (mutation.addedNodes[J], "dialog");
        checkForCSS_ClassName(mutation.addedNodes[J], "reply-to-thread");
      }
    }
    else if (mutation.type == "attributes") {
      checkForCSS_Class (mutation.target, "dd-menu");
      checkForCSS_ClassName(mutation.target, "reply-to-thread");
      checkForCSS_Class (mutation.target, "dialog");
    }
  });
}

/**
 * Checks for the CSS class
 * @param {Number} a
 * @param {Number} b
 * @return {Number} sum
 */
function checkForCSS_ClassName (node, className) {
    if (node.nodeType === 1) {
        if (node.classList.contains (className) ) {
					test();
        }
    }
}

/**
 * Checks the passed in node for the passed in CSS class name.
 * Depending on the class name, different actions will be carried out.
 * @param {node} node to check
 * @param {string} class name to check
 * @return void
 */
function checkForCSS_Class (node, className) {
  if (node.nodeType === 1) {
    if (node.classList.contains (className) ) {
      switch (className) {
        case "dialog":
          // Adding a button with 4ChanX
          addButtonX();
          break;
        case "dd-menu":
          // adding a button with vanilla 4chan
          addButton();
          break;
        case "reply-to-thread":
          // adding the wallet address to the name field
          test();
          break;
      }
    }
  }
}
