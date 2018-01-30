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
favorite OS? An OmniOS Support Package will cater for all these needs.

Fill in the form below and we will email you an invoice.

The cost for the support contract is 500 USD per server.

<form id="invoice_form">
<div class="row">
<div class="input-field col s12 offset-m1 m10 offset-l2 l8">
    <input placeholder="First name and last name (printed on invoice)" name="name" id="name_fld" type="text" class="validate">
    <label for="name">Your Name</label>
</div>
<div class="input-field col s12 offset-m1 m10 offset-l2 l8">
    <input placeholder="your@email" name="email" id="email_fld" type="email" class="validate">
    <label for="name">Your eMail Address</label>
</div>
<div class="input-field col s12 offset-m1 m10 offset-l2 l8">
    <input placeholder="Company name" name="company" id="company_fld" type="text" class="validate">
    <label for="name">Company</label>
</div>
<div class="input-field col s12 offset-m1 m10 offset-l2 l8">
    <input placeholder="your reference (printed on invoice)" name="ref" id="ref_fld" type="text" class="validate">
    <label for="name">Ref</label>
</div>
<div class="input-field col s12 offset-m1 m10 offset-l2 l8">
    <textarea placeholder="postal address (printed on invoice)" name="address" id="address_fld" class="materialize-textarea validate"></textarea>
    <label for="address">Address</label>
</div>
<div class="input-field col s6 offset-m1  m5 offset-l2 l4">
    <input placeholder="500 USD per server" name="amount" id="amount_fld" type="text" class="validate">
    <label>Amount</label>
</div>
<div class="input-field col s6 m5 l4">
    <select id="currency_fld">
      <option default value="usd">US Dollars</option>
      <option value="gbp">GB Pounds</option>
      <option value="eur">Euros</option>
      <option value="chf">Swiss Francs</option>
    </select>
    <label>Currency</label>
</div>
<div class="col s12 offset-m1 m10 offset-l2 l8">
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
          contentType: 'application/json; corset=utf-8',
          data: JSON.stringify(data)
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
		 jQuery('#notice').html( <h2><i class="material-icons">sms_failed</i> ' +
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
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
})();</script>

You can also use tradtional banking transactions to send us your
contributions by paying directly to our account here in Switzerland.

IBAN CH22 0900 0000 6188 9767 7<br/>
BIC POFICHBEXX<br/>
Verein OmniOS Community Edition

If you have questions regarding your subscription, or if you want to
discuss other options to support our work, please feel free to contact <a
href="mailto:patrons@omniosce.org">patrons@omniosce.org</a> at any time.

## How your payments are processed

Our donation system is using <a href="https://stripe.com">stripe.com</a> as a payment provider.
We do not keep ANY information local. Credit card numbers are NOT available to us at any point
in the payment process. The integration of <a href="https://stripe.com">stripe.com</a> and all the user
interactions are handled by our <a href="https://github.com/omniosorg/ooceapps">OOceApps</a> package.

