---
layout: page
title: Support Contract
order: 11
show_in_menu: false
show_in_sidebar: false
---

# OmniOSce Support Contract

Are you running your Servers on OmniOS Community Edition? Would you like to
ensure you are not left alone if you run into trouble with the devices?
Would you like to ensure the continued maintenance and development of your
favorite OS? The "OmniOS CE Prime Enterprise Support Package" will cater for all these needs.

Fill in the form below and we will email you an invoice.

The cost for the support contract is 500 USD per server.

## Invoice Request Form

<form id="invoice-form">
<div class="row">
<div class="input-field col s12 m6">
    <input placeholder="first name and last name" name="name" id="name_fld" type="text" class="validate">
    <label for="name">Your Name</label>
</div>
<div class="input-field col s12 m6">
    <input placeholder="your@email" name="email" id="email_fld" type="email" class="validate">
    <label for="name">Your eMail Address</label>
</div>
<div class="input-field col s12 m6">
    <input placeholder="company name" name="company" id="company_fld" type="text" class="validate">
    <label for="name">Company</label>
</div>
<div class="input-field col s12 m6">
    <input placeholder="your invoice reference (printed on invoice)" name="ref" id="ref_fld" type="text" class="validate">
    <label for="name">Ref</label>
</div>
<div class="input-field col s12">
    <textarea placeholder="postal address" name="address" id="address_fld" class="materialize-textarea validate"></textarea>
    <label for="address">Address</label>
</div>
<div class="input-field col s8 m4">
    <input placeholder="500$ per server" name="amount" id="amount_fld" type="text" class="validate">
    <label>Amount</label>
</div>
<div class="input-field col s4 m2">
    <select id="currency_fld">
      <option default value="USD">USD</option>
      <option value="GBP">GBP</option>
      <option value="EUR">EUR</option>
      <option value="CHF">CHF</option>
    </select>
    <label>Currency</label>
</div>
<div class="col s12 m6">
    <button style="width: 100%" id="get-invoice" class="btn waves-effect waves-light btn-large" type="submit" name="action"><i class="material-icons
right">done</i>Request Invoice</button>
</div>
</div>
</form>
<div id="notice"></div>

<script>
(function(){
    document.getElementById('invoice-form').addEventListener('submit', function(e) {
       e.preventDefault();
       jQuery('#invoice-form').slideUp();
       jQuery('#notice').html("<h2>Processing your Request ... " +
           "<img src=/assets/images/spinner.gif></h2>");
       var data = {};
       ['name','company','address',
        'currency','amount','email','ref'].forEach(function(fld,i){
	   data[fld] = jQuery('#' + fld + '_fld').val();
       });
       jQuery.ajax('https://apps.omniosce.org/invoice/create', {
          dataType: 'json',
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data),
          success: function(msg){
	    switch (msg.status){
	       case 'ok':
	          jQuery('#notice').html(
                    '<h2><i class="material-icons">check</i> ' +
                    'Check your mailbox. We have sent you the requested invoice'
	  	    +' by email.</h2>' +
                    '<h3>Please contact ' +
                    '<a href="mailto:patrons@omniosce.org">patrons@omniosce.org</a> ' +
                    'if the message does not arrive within a few minutes.</h3>'
                  );
		  break;
		default:
		 jQuery('#invoice-form').slidDown();
		 jQuery('#notice').html('<h2><i class="material-icons">sms_failed</i> ' +
	            'There was a problem processing your request: ' + msg.text
		    + ' Please contact <a href="mailto:patrons@omniosce.org">patrons@omniosce.org</a>.</h2>'
                );
	     }	   
          },
          error: function(xhr,status){
             jQuery('#notice').html('<h2><i class="material-icons">sms_failed</i> ' +
                'There was a problem processing your request. Please contact ' +
                '<a href="mailto:patrons@omniosce.org">patrons@omniosce.org</a>.</h2>');
          }
       });
   });
})();</script>

If you have questions regarding our support offering, or if you want to
discuss other options to support our work, please feel free to contact <a
href="mailto:patrons@omniosce.org">patrons@omniosce.org</a> at any time.
