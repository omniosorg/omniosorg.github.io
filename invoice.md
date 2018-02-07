---
layout: page
title: Commercial Support
order: 10
show_in_menu: true
show_in_sidebar: true
---

# OmniOSce Support Contract

Are you running your Servers on OmniOS Community Edition? Would you like to
ensure you are not left alone if you run into trouble with the devices?
Would you like to ensure the continued maintenance and development of your
favorite OS? The "OmniOS Support Package" will cater for all these needs.

The support package includes weekly security updates as necessary, LTS releases with
one year migration overlap and direct developer access for second level
support.  Support comes with a best effort reaction time of 4 hours on our
Gitter support channel.  This contract does NOT include any guaranteed
problem resolutions.  Depending on the nature of your request we will offer
custom development and debugging services on a case by case basis and we
will facilitate contacts with relevant domain experts from our network.

Fill in the form below and we will email you an invoice. The support contract
runs for 12 months and costs 500 USD per server.


<form id="invoice-form">

<h2>Invoice Request Form</h2>

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
    <input placeholder="1000" name="amount" id="amount_fld" type="text" class="validate">
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
       var data = {};
       ['name','company','address',
        'currency','amount','email','ref'].forEach(function(fld,i){
	   data[fld] = jQuery('#' + fld + '_fld').val();
       });
       jQuery.ajax('https://apps.omniosce.org/invoice/request', {
          dataType: 'json',
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data),
          success: function(msg){
	    switch (msg.status){
	       case 'ok':
		  jQuery('#invoice-form').slideUp();
	          jQuery('#notice').html(
                    '<h2><i class="material-icons">check</i> ' +
                    'Check your mailbox. We have sent you the invoice download link.'
	  	    +'</h2>' +
                    '<h3>Please contact ' +
                    '<a href="mailto:patrons@omniosce.org">patrons@omniosce.org</a> ' +
                    'if the message does not arrive within a few minutes.</h3>'
                  );
		  break;
		case 'error':
		   var $label = jQuery('#'+msg.target + ' + label');
		   var $field = jQuery('#'+msg.target);
		   if ($label){
			$label.attr('data-error',msg.text);
                        $field.addClass('invalid');
                        $field[0].scrollIntoView();
                        $field.focus();
			break;
		    }
		default:
		   jQuery('#notice').html('<h2><i class="material-icons">sms_failed</i> ' +
	            'There was a problem processing your request: ' + msg.text
		    + ' Please contact <a href="mailto:patrons@omniosce.org">patrons@omniosce.org</a>.</h2>');
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
