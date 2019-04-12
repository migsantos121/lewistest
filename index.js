var apiResult = [];
var dropdownNames = [{
	label: "Category",
	abbr: "cat",
	sub: "reg",
}, {
	label: "Region",
	abbr: "name",
	sub: "lat"
}, {
	label: "Laterality",
	abbr: "name",
	sub: null
}];

var toSelList = [];
var selData = [];
var activeLevel = -1;

function RPCCall(successCallback) {
 $.ajax({
	 url : "https://rpc.aihealth.us/slhs/v1/json-rpc",
	 type : 'POST',
	 data : JSON.stringify({
		 "jsonrpc" : "2.0",
		 "method" : "condition.list",
		 "id" : "TEST",
		 "params": { "filter": {} }
	 }),
	 dataType : "json",
	 success : function(rpcResult) {
	 	var result = rpcResult.result;
	 	successCallback(result);
	 },
	 error: function (xhr, ajaxOptions, thrownError) {
		 console.error(xhr.status);
		 console.error(thrownError);
	 } 
  });
};

RPCCall(function(result) {
	apiResult = result;
	toSelList.push(result);
	activeLevel = 0;
	renderDropdowns();
});

function onSelect(idx, itemIdx) {
	activeLevel = idx + 1;
	selData[idx] = itemIdx + 1;
	selData[idx + 1] = 0;
	toSelList[idx + 1] = toSelList[idx][itemIdx][dropdownNames[idx]["sub"]];
	console.log("toSelList", toSelList, dropdownNames[idx]["sub"], toSelList[idx][itemIdx]);
	renderDropdowns();
}

function canExpand(idx) {
	return activeLevel >= idx && toSelList[idx];
}

function renderDropdowns(){
	if (apiResult && apiResult.length) {
		var html = dropdownNames.map((dropdown, idx) => {
			return `<div class="dropdown-wrapper col-md-3 col-lg-3">
			  <div>
			    <label>${dropdown.label}</label>
			  </div>
			  <div class="dropdown ${canExpand(idx)? "active": "disabled"}">
		        <div class="more-btn">
		          <span class="selected-value">${selData[idx]? toSelList[idx][selData[idx]-1][dropdown["abbr"]]: ""}</span>
		          <span class="triangle"></span>
		        </div>
		        <ul class="dropdown-menu">
		          ${canExpand(idx)
		          ? toSelList[idx].map((dropdownItem, itemIdx) => `
		          	  <li class="${selData[idx]-1 == itemIdx? "selected": ""}">
			            <a onclick="onSelect(${idx}, ${itemIdx})">${dropdownItem[dropdown["abbr"]]}</a>
			          </li>
		          	`).join("")
		          : "" }
		        </ul>
		      </div>
		    </div>`
		}).join("");

		$("#dropdown-container").html(html);
	} else {
		$("#dropdown-container").html("<h1>Loading ...</h1>");
	}
}

renderDropdowns();